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

	function nfa2dfa(frag, delimiter) {

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
		function closureOf2(initState) {
			var states = {}
			for (var i in [].concat(initState)) {
				states[initState[i]] = true
			}

			stackGenerate({
				initial: initState,
				next: function (state) {
					var trans = frag.transitions[state]
					var nextStates = []
					for (var i = 0, ii = trans.length; i < ii; i += 2) {
						// match epsilon transitions
						if (trans[i] == '\0') {
							nextStates.push(trans[i + 1])
						}
					}
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

			// This makes it possible to do a deep compare on macrostates quickly
			return Object.keys(states).sort()
		}


		/**
		 * State is singular but actually an array of states
		 * because the subset construction creates states
		 * that are the union of other states
		 */
		function goesTo(state, chr) {
			var output = []

			for (var i = 0, ii = state.length; i < ii; ++i) {
				var trans = frag.transitions[state[i]]
				for (var j = 0, jj = trans.length; j < jj; j += 2) {
					if (trans[j] == chr) {
						var dest = trans[j + 1]
						// push destination state onto output if it is new
						if (output.indexOf(dest) < 0) {
							output.push(dest)
						}
					}
				}
			}

			return closureOf2(output)
		}


		/**
		 * Returns the characters that allow
		 * a transition out of the state
		 */
		function exits(state) {
			var chars = []

			for (var i = 0, ii = state.length; i < ii; ++i) {
				var trans = frag.transitions[state[i]]

				for (var j = 0, jj = trans.length; j < jj; j += 2) {
					if (trans[j] != '\0' && chars.indexOf(trans[j]) < 0) {
						chars.push(trans[j])
					}
				}
			}

			return chars
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
		var processStack = [closureOf2([frag.initial])]
		var initialStateKey = processStack[0].join(delimiter)
			, transitions
			, newTransitionTable = {}
			, inverseReplacementMap = {}
			, tempAcceptStates = []
			, aliasMap = {}


		var transitionTable = {},
			acceptStates = []

		// Build the transition table
		while (processStack.length > 0) {
			var current = processStack.pop()
			var currentStateKey = current.join(delimiter)
			transitionTable[currentStateKey] = []

			// Get all characters leaving this state
			var exitChars = exits(current)

			// Run goTo on each character
			for (var i = 0, ii = exitChars.length; i < ii; ++i) {
				var discoveredState = goesTo(current, exitChars[i])
				var discoveredStateKey = discoveredState.join(delimiter)

				if (!transitionTable[discoveredStateKey]) {
					processStack.push(discoveredState)
				}

				// A macrostate is an accept state if it contains any accept microstate
				for (var j = 0, jj = discoveredState.length; j < jj; ++j) {
					if (frag.accept.indexOf(discoveredState[j]) >= 0 &&
						acceptStates.indexOf(discoveredStateKey) < 0) {
						acceptStates.push(discoveredStateKey)
					}
				}

				transitionTable[currentStateKey].push(exitChars[i], discoveredStateKey)
			}
		}

		/*
		 * At this point we actually have a correct DFA, and the rest of this logic is just cleaning up
		 * the compound states into something more human readable
		 */

		var collisionMap = {},
			replacementMap = {}

		/*
		 * If a macrostate contains only one originally accepted state
		 * then we should replace its name with the name of that state
		 * so that the labels make sense
		 */
		for (var k in transitionTable) {
			// Build an array of states in this macrostate that are accept states
			var states = k.split(delimiter),
				accepted = []

			for (var i = 0, ii = states.length; i < ii; ++i) {
				if (frag.accept.indexOf(states[i]) > -1) {
					accepted.push(states[i])
				}
			}

			// This macrostate only has one accepted state
			if (accepted.length === 1) {
				accepted = accepted[0]
				// Check for a collision
				if (collisionMap[accepted] != null) {
					delete replacementMap[collisionMap[accepted]]
				}
				else {
					replacementMap[k] = accepted
					collisionMap[accepted] = k
				}
			}
		}

		// At this point, replacementMap is {findstate: replacementstate}
		// Go on and replace findstate with replacementstate everywhere in the DFA

		var replacement = replacementMap[initialStateKey]

		if (replacement != null) {
			initialStateKey = replacement
		}

		for (var k in transitionTable) {
			transitions = transitionTable[k]

			for (var j = 1, jj = transitions.length; j < jj; j += 2) {
				replacement = replacementMap[transitions[j]]

				if (replacement != null) {
					transitions[j] = replacement
				}
			}

			replacement = replacementMap[k]

			if (replacement != null) {
				newTransitionTable[replacement] = transitions
			} else {
				newTransitionTable[k] = transitions
			}
		}

		for (var j = 0, jj = acceptStates.length; j < jj; ++j) {
			replacement = replacementMap[acceptStates[j]]
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

	return nfa2dfa
})