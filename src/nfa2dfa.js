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
	var EPSILON = '\0'


	// returns the characters that allow a transition
	// out of the dfaState
	// 返回那些使得dfa状态集合中的某一状态转移到另一状态的字符, 不包括空字符
	function getExitChars(dfaState, graph) {
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
	function closureOf(initStates, graph) {
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


	function nfaToDFA(frag, delimiter) {


		/**
		 * Returns the closure of the state.
		 * This means all states reachable via epsilon-transitions
		 *
		 * State is singular but actually an array of states
		 * because the subset construction creates states
		 * that are the union of other states
		 */
		// 这是个错的啊, 怎么会返回数字呢
		function closureOf000(state) {
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

			//return closureOf(s.toArray(), graph)
			return closureOf000(s.toArray())
		}


		if (delimiter == null) {
			// Just some obscure char that looks like a pipe
			delimiter = String.fromCharCode(3193)
		}

		// If delimiter is in any of the states, fail
		for (var k in frag.transitions) {
			if (k.indexOf(delimiter) > -1) {
				return new Error('Delimiter "' + delimiter + '" collision in state "' + k + '"')
			}
		}


		// Start algorithm by computing the closure of state 0
		var graph = Graph.fromJSON(frag.transitions)
		var processStack = [closureOf([frag.initial], graph)],
			initialStateKey = processStack[0].join(delimiter)


		// Build the transition table
		var graph2 = new Graph,
			map = {},
			acceptDFAStates = new Set // DFA State is an array of states of NFA
		while (processStack.length > 0) {
			var currentDFAState = processStack.pop()
			var currentDFAStateKey = currentDFAState.join(delimiter)
			map[currentDFAStateKey] = true

			// get all characters leaving this state
			var exitChars = getExitChars(currentDFAState, graph)

			// Run goTo on each character
			exitChars.each(function (exitChar) {
				var nextDFAState = goesTo2(currentDFAState, exitChar, graph)
				var nextDFAStateKey = nextDFAState.join(delimiter)

				// a DFA state is an accept state if it contains any accept NFA state
				for (var i in nextDFAState) {
					if (frag.accept.indexOf(nextDFAState[i]) >= 0) {
						acceptDFAStates.add(nextDFAStateKey)
						break
					}
				}

				graph2.addEdge(currentDFAStateKey, nextDFAStateKey, exitChar)

				if (!map[nextDFAStateKey]) {
					processStack.push(nextDFAState)
				}
			})
		}
		var transitionTable = graph2.toJSON()


		/*
		 * At this point we actually have a correct DFA, and the rest of this logic is just cleaning up
		 * the compound states into something more human readable
		 */


		/*
		 * If a DFA state contains only one originally accepted state
		 * then we should replace its name with the name of that state
		 * so that the labels make sense
		 */
		var replacementMap = {},
			collisionMap = {}
		for (var dfaStateKey in transitionTable) {
			// Build an array of states in this macrostate that are accept states
			var dfaState = dfaStateKey.split(delimiter),
				nfaAcceptStateInDFA = []


			for (var i in dfaState) {
				if (frag.accept.indexOf(dfaState[i]) > -1) {
					nfaAcceptStateInDFA.push(dfaState[i])
				}
			}

			// This macrostate only has one accepted state
			if (nfaAcceptStateInDFA.length === 1) {
				nfaAcceptStateInDFA = nfaAcceptStateInDFA[0]
				// Check for a collision
				// @TODO 这里又问题, 还是有可能加进来
				if (collisionMap[nfaAcceptStateInDFA] != null) { // 这个接受状态在其他集合里又出现了, 所以去掉冲突
					delete replacementMap[collisionMap[nfaAcceptStateInDFA]]
				} else {
					replacementMap[dfaStateKey] = nfaAcceptStateInDFA  // k替换到原始的名字
					collisionMap[nfaAcceptStateInDFA] = dfaStateKey
				}
			}
		}


		/* At this point, replacementMap is {findstate: replacementstate}
		 * Go on and replace findstate with replacementstate everywhere in the DFA
		 */

		// replace init state
		var replacement = replacementMap[initialStateKey]
		initialStateKey = replacement ? replacement : initialStateKey


		// replace all states
		graph2 = Graph.fromJSON(transitionTable)
		graph2.changeNodes(replacementMap)
		var newTransitionTable = graph2.toJSON()


		// replace accept states
		acceptDFAStates = _.map(acceptDFAStates.toArray(),
			function (acceptDFSState) {
				var replacement = replacementMap[acceptDFSState]
				return replacement ? replacement : acceptDFSState
			})


		// DFA state map to NFA states
		var containedNFAStates = {}
		for (var dfaStateKey in replacementMap) {
			containedNFAStates[dfaStateKey] = replacementMap[dfaStateKey].split(delimiter)
		}

		// Use the inverse map to create the aliasMap
		var aliasMap = {}
		for (var dfaStateKey in newTransitionTable) {
			aliasMap[dfaStateKey] = containedNFAStates[dfaStateKey]
				? containedNFAStates[dfaStateKey]
				: dfaStateKey.split(delimiter)
		}


		// Return the definition
		return {
			initial: initialStateKey,
			accept: acceptDFAStates,
			transitions: newTransitionTable,
			aliasMap: aliasMap
		}
	}

	nfaToDFA._getExitChars = getExitChars

	return nfaToDFA
})


//var createDFAState = function (nfaStates) {
//	return {
//		_key: nfaStates.join(delimiter),
//		key: function () {
//			this._key
//		}
//	}
//}