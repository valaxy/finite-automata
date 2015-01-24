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
	var Set = require('./set')
	var Graph = require('bower_components/graph/src/directed-linked-graph')
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


	/**
	 * Returns the closure of the state.
	 * This means all states reachable via epsilon-transitions
	 *
	 * State is singular but actually an array of states
	 * because the subset construction creates states
	 * that are the union of other states
	 */
	// 这是个错的啊, 怎么会返回数字呢
	var closureOf000 = function (state) {
		var closure = [].concat(state)

		while (true) {
			var discoveredStates = []

			for (var i in closure) {
				graph.eachEdge(function (from, to, edge) {
					if (edge === '\0') { // match epsilon transitions
						if (closure.indexOf(to) < 0) {
							discoveredStates.push(to)
						}
					}
				}, closure[i])
			}

			if (discoveredStates.length === 0) {
				break
			} else {
				closure.push.apply(closure, discoveredStates)
			}

			discoveredStates = []
		}

		// This makes it possible to do a deep compare on macrostates quickly
		return closure.sort()
	}


	function goesTo2(states, chr, graph) {
		var s = new Set

		for (var i in states) {
			var state = states[i]
			graph.eachEdge(function (from, to, edge) {
				if (edge == chr) {
					s.add(to)
				}
			}, state)
		}

		//console.log(closureOf000(s.toArray()))
		//console.log(closureOf(s.toArray(), graph))

		return closureOf(s.toArray(), graph)
		//return closureOf000(s.toArray())
	}


	// build the new graph
	function buildGraph(delimiter, graph, initialDFAState, acceptStates) {
		// initialDFAState is the only state in this graph at this moment
		var newGraph = new Graph
		var initialDFAStateKey = initialDFAState.join(delimiter)
		newGraph.addNode(initialDFAStateKey)

		// search
		var processStack = [initialDFAState]
		var mark = {}
		var acceptDFAStates = new Set // DFA State is an array of states of NFA
		mark[initialDFAStateKey] = true
		while (processStack.length > 0) {
			var currentDFAState = processStack.pop()
			var currentDFAStateKey = currentDFAState.join(delimiter)

			// get all characters leaving this state
			var exitChars = getExitChars(currentDFAState, graph)

			// run goTo on each character
			exitChars.each(function (exitChar) {
				var nextDFAState = goesTo2(currentDFAState, exitChar, graph)
				var nextDFAStateKey = nextDFAState.join(delimiter)

				newGraph.addEdge(currentDFAStateKey, nextDFAStateKey, exitChar)

				//// a DFA state is an accept state if it contains any accept NFA state
				//for (var i in nextDFAState) {
				//	if (acceptStates.indexOf(nextDFAState[i]) >= 0) {
				//		acceptDFAStates.add(nextDFAStateKey)
				//		break
				//	}
				//}

				if (!mark[nextDFAStateKey]) {
					processStack.push(nextDFAState)
					mark[nextDFAStateKey] = true
				}
			})
		}

		for (var dfaStateKey in mark) {
			var dfaState = dfaStateKey.split(delimiter)
			for (var i in dfaState) {
				if (acceptStates.indexOf(dfaState[i]) >= 0) {
					acceptDFAStates.add(dfaStateKey)
					break
				}
			}
		}


		return {
			graph: newGraph,
			acceptDFAStates: acceptDFAStates
		}
	}

	function checkDelimiter(delimiter, states) {
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


	function nfaToDFA(frag, delimiter) {
		var delimiter = checkDelimiter(delimiter, _.keys(frag.transitions))
		var graph = Graph.fromJSON(frag.transitions)
		var initialDFAState = closureOf([frag.initial], graph)
		var initialStateKey = initialDFAState.join(delimiter)
		var result = buildGraph(delimiter, graph, initialDFAState, frag.accept)

		var newGraph = result.graph
		var acceptDFAStates = result.acceptDFAStates

		/*
		 * At this point we actually have a correct DFA, and the rest of this logic is just cleaning up
		 * the compound states into something more human readable
		 */


		/*
		 * If a DFA state contains only one originally accepted state
		 * then we should replace its name with the name of that state
		 * so that the labels make sense
		 */
		var replacementMap = {}

		// collision has 3 states:
		// - 1: can never be named to dfa state
		// - a string: has been named to a dfa state
		// - no-exist: can be 1 or set
		var collision = {}
		var transitionTable = newGraph.toJSON()


		// find accept states
		newGraph.eachNode(function (dfaStateKey) {
			var nfaStates = dfaStateKey.split(delimiter)

			// find nfa accept states in this dfa state
			var acceptNFAStates = _.filter(nfaStates, function (nfaState) {
				return frag.accept.indexOf(nfaState) >= 0
			})

			// this dfa state only has one accepted nfa state
			if (acceptNFAStates.length === 1) {
				var acceptNFAState = acceptNFAStates[0]
				// Check for a collision
				// 这个接受状态在其他集合里又出现了, 所以去掉冲突
				if (collision[acceptNFAState]) {
					delete replacementMap[collision[acceptNFAState]]
				} else {
					replacementMap[dfaStateKey] = acceptNFAState  // replace to original name
					collision[acceptNFAState] = dfaStateKey
				}
			}
		})


		/* At this point, replacementMap is {findstate: replacementstate}
		 * Go on and replace findstate with replacementstate everywhere in the DFA
		 */

		// replace init state
		var replacement = replacementMap[initialStateKey]
		initialStateKey = replacement ? replacement : initialStateKey


		// replace all states
		newGraph = Graph.fromJSON(transitionTable)
		newGraph.changeNodes(replacementMap)


		// replace accept states
		acceptDFAStates = _.map(acceptDFAStates.toArray(),
			function (acceptDFSState) {
				var replacement = replacementMap[acceptDFSState]
				return replacement ? replacement : acceptDFSState
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
			transitions: newGraph.toJSON(),
			aliasMap: getAliasMap(newGraph, containedNFAStates, delimiter)
		}
	}

	nfaToDFA._getExitChars = getExitChars
	nfaToDFA._buildGraph = buildGraph

	return nfaToDFA
})
