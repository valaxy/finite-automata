(function (factory) {
	if (typeof exports === 'object') {
		var result = factory(require, exports, module)
		if (result) {
			module.exports = result
		}
	} else {
		define(factory)
	}
})(function (require) {
	var stackGenerate = require('./stack-generate')
	var Set = require('bower_components/algorithm-data-structure/src/set/set')
	var DFAStateBundle = require('./nfa-dfa/dfa-state-bundle')
	var Graph = require('bower_components/algorithm-data-structure/src/graph/directed-linked-graph')
	var map = require('bower_components/candy.js/src/map')
	var EPSILON = '\0'


	// returns the characters that allow a transition
	// out of the dfaState
	// 返回那些使得dfa状态集合中的某一状态转移到另一状态的字符, 不包括空字符
	var getExitChars = function (dfaState, graph) {
		var s = new Set
		_.each(dfaState, function (state) {
			graph.eachEdge(function (from, to, edge) {
				if (edge != EPSILON) {
					s.add(edge)
				}
			}, state)
		})
		return s
	}


	// returns the closure of the state
	// this means all states reachable via epsilon-transitions
	// initStates can be array or just a state
	// 从初始状态开始只通过'空字符'转换到达的状态集合
	var closureOf = function (initStates, graph) {
		var stateMark = {}
		for (var i in [].concat(initStates)) {
			stateMark[initStates[i]] = true
		}
		stackGenerate({
			initial: initStates,
			next: function (state) {
				var nextStates = []
				graph.eachEdge(function (from, to, edge) {
					if (edge == '\0') {
						nextStates.push(to)
					}
				}, state)
				return nextStates
			},
			push: function (state) {
				if (state in stateMark) {
					return false
				} else {
					stateMark[state] = true
					return true
				}
			}
		})

		// sort makes it possible to do a deep compare quickly
		return Object.keys(stateMark).sort()
	}


	// map: dfaStateKey -> [nfaState, ..., nfaState]
	var getAliasMap = function (graph, containedNFAStates, delimiter) {
		var aliasMap = {}
		graph.eachNode(function (dfaStateKey) {
			aliasMap[dfaStateKey] = containedNFAStates[dfaStateKey]
				? containedNFAStates[dfaStateKey]
				: dfaStateKey.split(delimiter)
		})
		return aliasMap
	}


	var goesTo = function (states, chr, graph) {
		var s = new Set

		for (var i in states) {
			var state = states[i]
			graph.eachEdge(function (from, to, edge) {
				if (edge == chr) {
					s.add(to)
				}
			}, state)
		}

		return closureOf(s.toArray(), graph)
	}


	// build the new graph
	var buildDFAGraph = function (delimiter, graph, initialDFABundle, acceptStates) {
		// initialDFAState is the only state in this graph at this moment
		var newGraph = new Graph
		newGraph.addNode(initialDFABundle.key())


		// search
		var processStack = [initialDFABundle.nfaStates()]
		var mark = {}

		mark[initialDFABundle.key()] = initialDFABundle
		while (processStack.length > 0) {
			var currentDFAState = processStack.pop()
			var currentDFAStateKey = currentDFAState.join(delimiter)

			// get all characters leaving this state
			var exitChars = getExitChars(currentDFAState, graph)

			// run goTo on each character
			exitChars.each(function (exitChar) {
				var nextDFAState = goesTo(currentDFAState, exitChar, graph)
				var nextDFAStateKey = nextDFAState.join(delimiter)

				newGraph.addEdge(currentDFAStateKey, nextDFAStateKey, exitChar)

				if (!mark[nextDFAStateKey]) {
					processStack.push(nextDFAState)
					mark[nextDFAStateKey] = new DFAStateBundle(nextDFAState, delimiter)
				}
			})
		}

		// at this point, all the NFA states have been searched and
		// all the NFA bundles can be generated

		// get all the accept DFA bundles
		var acceptDFAStates = []
		_.each(mark, function (dfaBundle) {
			var nfaStates = dfaBundle.nfaStates()
			for (var i in nfaStates) {
				if (_.contains(acceptStates, nfaStates[i])) {
					acceptDFAStates.push(dfaBundle)
					break
				}
			}
		})


		return {
			graph: newGraph,
			acceptDFAStates: acceptDFAStates
		}
	}

	var checkDelimiter = function (delimiter, states) {
		if (!delimiter) {
			return String.fromCharCode(3193) // Just some obscure char that looks like a pipe
		}

		// if delimiter is in any of the states, fail
		_.each(states, function (state) {
			if (state.indexOf(delimiter) > -1) {
				throw new Error('Delimiter "' + delimiter + '" collision in state "' + state + '"')
			}
		})

		return delimiter
	}


	// If a DFA state contains only one originally accepted state
	// then we should replace its name with the name of that state
	// so that the labels make sense
	function getReplacementMap(allAcceptNFAStates, dfaBundles) {
		var replacementMap = {}
		var collision = {}

		// find accept DFA bundle
		_.each(dfaBundles, function (dfaBundle) {
			// find NFA accept states in this DFA bundle
			var acceptNFAStates = _.filter(dfaBundle.nfaStates(), function (nfaState) {
				return _.contains(allAcceptNFAStates, nfaState)
			})

			if (acceptNFAStates.length === 1) {
				var acceptNFAState = acceptNFAStates[0]
				// check for a collision
				// acceptNFAState可能在多个dfaState里出现, 一旦acceptNFAState出现在多个dfaState里
				// 那么任何一个dfaState都不能还原为原来的名称
				if (collision[acceptNFAState]) {
					delete replacementMap[collision[acceptNFAState]]
				} else {
					replacementMap[dfaBundle.key()] = acceptNFAState  // replace to original name
					collision[acceptNFAState] = dfaBundle.key()
				}
			}
		})

		return replacementMap
	}


	function nfaToDFA(frag, delimiter) {
		// init initial condition
		var delimiter = checkDelimiter(delimiter, _.keys(frag.transitions))
		var graph = Graph.fromJSON(frag.transitions)
		var initialDFAState = closureOf([frag.initial], graph)
		var initialDFABundle = new DFAStateBundle(initialDFAState, delimiter)

		// build the graph about DFA
		var result = buildDFAGraph(delimiter, graph, initialDFABundle, frag.accept)
		var dfaGraph = result.graph
		var acceptDFAStates = result.acceptDFAStates


		// At this point we actually have a correct DFA, and the rest of this logic is just cleaning up
		// the compound states into something more human readable
		var dfaStates = _.map(dfaGraph.nodes(), function (dfaStateKey) {
			return new DFAStateBundle(dfaStateKey.split(delimiter), delimiter)
		})
		var replacementMap = getReplacementMap(frag.accept, dfaStates)


		// Go on and replace states in the DFA
		// replace initial state
		var replacement = replacementMap[initialDFABundle.key()]
		var initialStateKey = replacement ? replacement : initialDFABundle.key()


		// replace all states
		dfaGraph.changeNodes(replacementMap)


		// replace accept states
		acceptDFAStates = _.map(acceptDFAStates,
			function (acceptDFSState) {
				var replacement = replacementMap[acceptDFSState.key()]
				return replacement ? replacement : acceptDFSState.key()
			})


		// DFA state map to NFA states
		var containedNFAStates = map.changeValue(replacementMap,
			function (dfaStateKey, nfaStateKeys) {
				return nfaStateKeys.split(delimiter)
			})


		// return the definition
		return {
			initial: initialStateKey,
			accept: acceptDFAStates,
			transitions: dfaGraph.toJSON(),
			aliasMap: getAliasMap(dfaGraph, containedNFAStates, delimiter)
		}
	}


	nfaToDFA._getExitChars = getExitChars
	nfaToDFA._buildGraph = buildDFAGraph
	nfaToDFA._getReplacementMap = getReplacementMap

	return nfaToDFA
})
