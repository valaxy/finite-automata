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
	// 返回那些使得dfa状态集合中的某一状态转移到另一状态的字符
	function getExitChars(dfaState, graph) {
		var s = new Set

		_.each(dfaState, function (state) {
			graph.eachEdge(function (from, to, edge) {
				if (edge != EPSILON) {
					s.add(edge)
				}
			}, state)
		})

		return s.toArray()
	}


	/**
	 * Returns the closure of the state.
	 * This means all states reachable via epsilon-transitions
	 *
	 * State is singular but actually an array of states
	 * because the subset construction creates states
	 * that are the union of other states
	 *
	 * 从s开始只通过'空字符'转换到达的状态集合
	 */
	function closureOf2(initState, graph) {
		var states = {}
		for (var i in [].concat(initState)) {
			states[initState[i]] = true
		}

		stackGenerate({
			initial: initState,
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
				if (state in states) {
					return false
				} else {
					states[state] = true
					return true
				}
			}
		})

		// sort makes it possible to do a deep compare on macrostates quickly
		return Object.keys(states).sort()
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
		function closureOf(state) {
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

		/**
		 * State is singular but actually an array of states
		 * because the subset construction creates states
		 * that are the union of other states
		 */
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

			return closureOf(s.toArray())
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


		var graph = Graph.fromJSON(frag.transitions)

		// Start algorithm by computing the closure of state 0
		var processStack = [closureOf2([frag.initial], graph)]
			, initialStateKey = processStack[0].join(delimiter)
			, current = []
			, exitChars = []
			, i = 0
			, ii = 0
			, j = 0
			, jj = 0
			, replacement
			, transitions
			, discoveredState
			, currentStateKey = ''
			, discoveredStateKey = ''
			, transitionTable = {}
			, newTransitionTable = {}
			, replacementMap = {}
			, inverseReplacementMap = {}
			, acceptStates = []
			, collisionMap = {}
			, aliasMap = {}


		var createDFAState = function (nfaStates) {
			return {
				_key: nfaStates.join(delimiter),
				key: function () {
					this._key
				}
			}
		}

		// Build the transition table
		while (processStack.length > 0) {
			current = processStack.pop()
			currentStateKey = current.join(delimiter)
			transitionTable[currentStateKey] = []

			// Get all characters leaving this state
			exitChars = getExitChars(current, graph)

			// Run goTo on each character
			for (i = 0, ii = exitChars.length; i < ii; ++i) {
				discoveredState = goesTo2(current, exitChars[i], graph)
				discoveredStateKey = discoveredState.join(delimiter)

				// A macrostate is an accept state if it contains any accept microstate
				for (j = 0, jj = discoveredState.length; j < jj; ++j) {
					if (frag.accept.indexOf(discoveredState[j]) >= 0 &&
						acceptStates.indexOf(discoveredStateKey) < 0) {
						acceptStates.push(discoveredStateKey)
						break
					}
				}

				transitionTable[currentStateKey].push(exitChars[i], discoveredStateKey)

				if (!transitionTable[discoveredStateKey]) {
					processStack.push(discoveredState)
				}
			}
		}

		//var currentStateKey
		//stackGenerate({
		//	initial: processStack,
		//	pop: function (current) {
		//		currentStateKey = current.join(delimiter)
		//		transitionTable[currentStateKey] = []
		//	},
		//	next: function (current) {
		//		var nexts = []
		//		var exitChars = exits(current)
		//		for (var i = 0, ii = exitChars.length; i < ii; ++i) {
		//			var discoveredState = goesTo(current, exitChars[i])
		//			nexts.push(discoveredState)
		//		}
		//		return nexts
		//	},
		//	push: function (discoveredState) {
		//		var discoveredStateKey = discoveredState.join(delimiter)
		//
		//		// A macrostate is an accept state if it contains any accept microstate
		//		for (var j = 0, jj = discoveredState.length; j < jj; ++j) {
		//			if (frag.accept.indexOf(discoveredState[j]) >= 0 &&
		//				acceptStates.indexOf(discoveredStateKey) < 0) {
		//				acceptStates.push(discoveredStateKey)
		//				break
		//			}
		//		}
		//
		//		transitionTable[currentStateKey].push(exitChars[i], discoveredStateKey)
		//
		//		return !transitionTable[discoveredStateKey]
		//	}
		//})


		/*
		 * At this point we actually have a correct DFA, and the rest of this logic is just cleaning up
		 * the compound states into something more human readable
		 */

		/*
		 * If a macrostate contains only one originally accepted state
		 * then we should replace its name with the name of that state
		 * so that the labels make sense
		 */
		for (var k in transitionTable) {
			// Build an array of states in this macrostate that are accept states
			var dfaState = k.split(delimiter),
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
					replacementMap[k] = nfaAcceptStateInDFA  // k替换到原始的名字
					collisionMap[nfaAcceptStateInDFA] = k
				}
			}
		}

		// At this point, replacementMap is {findstate: replacementstate}
		// Go on and replace findstate with replacementstate everywhere in the DFA

		replacement = replacementMap[initialStateKey]

		if (replacement != null) {
			initialStateKey = replacement
		}

		// 将状态替换掉
		var graph = Graph.fromJSON(transitionTable)
		graph.changeNodes(replacementMap)
		newTransitionTable = graph.toJSON()

		//for (var k in transitionTable) {
		//	var transition = transitionTable[k]
		//
		//	for (j = 1, jj = transition.length; j < jj; j += 2) {
		//		if (transition[j] in replacementMap) {
		//			transition[j] = replacementMap[transition[j]]
		//		}
		//	}
		//
		//	if (k in replacementMap) {
		//		newTransitionTable[replacementMap[k]] = transition
		//	} else {
		//		newTransitionTable[k] = transition
		//	}
		//}
		//-------------------------------------------------------------

		var tempAcceptStates = []
		for (var j in acceptStates) {
			var replacement = replacementMap[acceptStates[j]]
			if (replacement != null) {
				if (tempAcceptStates.indexOf(replacement) < 0) {
					tempAcceptStates.push(replacement)
				}
			} else if (tempAcceptStates.indexOf(acceptStates[j]) < 0) {
				tempAcceptStates.push(acceptStates[j])
			}
		}

		// Okay, now we need to tell the user what DFA states belong in each NFA state
		for (var k in replacementMap) {
			if (inverseReplacementMap[k] == null) {
				inverseReplacementMap[k] = replacementMap[k].split(delimiter)
			}
			// The else case will never happen because replacementMap[k] cannot exceed 1 in length
			// Since that would be a collision and we take care of that above
		}

		// Use the inverse map to create the aliasMap
		for (var k in newTransitionTable) {
			aliasMap[k] = inverseReplacementMap[k] ? inverseReplacementMap[k] : k.split(delimiter)
		}

		// Return the definition
		return {
			initial: initialStateKey,
			accept: tempAcceptStates,
			transitions: newTransitionTable,
			aliasMap: aliasMap
		}
	}

	nfaToDFA._getExitChars = getExitChars

	return nfaToDFA
})