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
	var StateMachine = require('./automata'),
		_minimize = require('./minimize'),
		string2dfa = require('./string2dfa'),
		nfa2dfa = require('./nfa2dfa')


	/**
	 * TODO: Verifying that a definition is sensible is
	 * pretty expensive. There should be an option that
	 * doesn't require such stringent checking.
	 */
	var Fragment = function Fragment(def, acceptName) {

		// OK to be a string literal, we'll construct a fragment from that
		if (typeof def == 'string') {
			def = string2dfa(def, acceptName)
		}
		// This is a shorthanded special case: the EOF character
		else if (def === -1) {
			def = {
				initial: 0
				, accept: [1]
				, transitions: {
					0: [-1, 1]
					, 1: []
				}
			}
		}

		var err = this.validate(def)

		if (err !== true) {
			throw err
		}

		this.initial = def.initial
		this.accept = def.accept
		this.transitions = def.transitions // it's matrix(邻接表)
	}


	/** \w */
	Fragment.createSingleAlphaChar = function () {
		var frag = new Fragment('a')
		frag.union(new Fragment('A'))
		for (var i = 1; i < 26; i++) {
			var ch = String.fromCharCode(97 + i)
			frag.union(new Fragment(ch))

			ch = String.fromCharCode(65 + i)
			frag.union(new Fragment(ch))
		}
		return frag
	}

	/** \d */
	Fragment.createSingleNumber = function () {
		var frag = new Fragment('0')
		for (var i = 1; i < 10; i++) {
			var ch = i + ''
			frag.union(new Fragment(ch))
		}
		return frag
	}


	Fragment.prototype.toDfa = function (delimiter) {
		return nfa2dfa(this._copyConfig(), delimiter)
	}

	Fragment.prototype.minimize = function (delimiter) {
		return _minimize(this.toDfa(delimiter))
	}

	Fragment.prototype.validate = function (def) {

		var i, ii, k

		if (!def) {
			return new Error('Fragment needs a definition')
		}

		if (def.initial == null) {
			return new Error('Fragment needs an initial state')
		}

		if (!Array.isArray(def.accept)) {
			return new Error('Fragment must have an array of accepted states')
		}

		if (def.transitions == null) {
			return new Error('Fragment must have a map of transitions')
		}

		// Make sure that accept states are in transitions
		for (i = 0, ii = def.accept.length; i < ii; ++i) {
			if (def.transitions[def.accept[i]] == null) {
				return new Error('Accept state "' + def.accept[i] +
				'" does not exist in the transition map')
			}
		}

		// Make sure that transition states are in transitions
		for (k in def.transitions) {
			if (!Array.isArray(def.transitions[k])) {
				return new Error('The transitions for ' + k + ' must be an array')
			}

			for (i = 1, ii = def.transitions[k].length; i < ii; i += 2) {
				if (def.transitions[def.transitions[k][i]] == null) {
					return new Error('Transitioned to ' + def.transitions[k][i] +
					', which does not exist in the transition map')
				}
			}
		}

		return true

	}

	/**
	 * @TODO Simulates this fragment on the input
	 */
	Fragment.prototype.test = function test(input) {
		return new StateMachine(this.minimize()).accepts(input)
	}

	/**
	 * BNF: rule = rule1 rule2
	 */
	Fragment.prototype.concat = function (other) {
		other = new Fragment(other._copyConfig())

		// when joining a to b, b should disambiguate itself from a
		other._resolveCollisions(this)

		// point the final states of a to the initial state of b
		for (var i = 0, ii = this.accept.length; i < ii; ++i) {
			this.transitions[this.accept[i]].push('\0', other.initial)
		}

		// set new accept states
		this.accept = other.accept

		// add all transitions from b to a
		for (var k in other.transitions) {
			this.transitions[k] = other.transitions[k]
		}

		return this
	}


	/**
	 * BNF: rule = rule1 | rule2
	 */
	Fragment.prototype.union = function (other) {
		other = new Fragment(other._copyConfig())

		// when joining a to b, b should disambiguate itself from a
		other._resolveCollisions(this)

		var oldInitial = this.initial

		// create a new initial state
		this.initial = this._findNoCollisionState('union')

		// watch for collisions in both sides!
		this.initial = other._findNoCollisionState(this.initial)

		// point new state to the other two initial states with epsilon transitions
		this.transitions[this.initial] = ['\0', oldInitial, '\0', other.initial]

		// add all transitions from b to a
		for (var k in other.transitions) {
			this.transitions[k] = other.transitions[k]
		}

		// multiply accept states
		this.accept.push.apply(this.accept, other.accept)

		return this
	}


	/**
	 * BNF: rule = rule1*
	 * Check out: https://cloudup.com/c64GMr1lTFj
	 * Source: http://courses.engr.illinois.edu/cs373/sp2009/lectures/lect_06.pdf
	 */
	Fragment.prototype.repeat = function () {
		// create a new initial state
		var newState = this._findNoCollisionState('repeat`') // @TODO fail when use repeat

		// point the final states to the initial state of b
		for (var i = 0, ii = this.accept.length; i < ii; ++i) {
			this.transitions[this.accept[i]].push('\0', this.initial)
		}

		this.transitions[newState] = ['\0', this.initial]
		this.initial = newState
		this.accept.push(newState)

		return this
	}


	Fragment.prototype.repeatAtLeastOnce = function () {
		// create a new initial state
		var newState = this._findNoCollisionState('repeat`') // @TODO fail when use repeat

		// point the final states to the initial state of b
		for (var i = 0, ii = this.accept.length; i < ii; ++i) {
			this.transitions[this.accept[i]].push('\0', this.initial)
		}

		this.transitions[newState] = ['\0', this.initial]
		this.initial = newState

		return this
	}


	/**
	 * Returns all the valid states.
	 */
	Fragment.prototype.states = function () {
		return Object.keys(this.transitions)
	}


	// return a copy of config para
	Fragment.prototype._copyConfig = function () {
		return {
			initial: this.initial,
			accept: JSON.parse(JSON.stringify(this.accept)),
			transitions: JSON.parse(JSON.stringify(this.transitions))
		}
	}


	// Resolves collisions with `other` by renaming states of `this`
	Fragment.prototype._resolveCollisions = function (other) {
		var otherStates = other.states()

		for (var i = 0, ii = otherStates.length; i < ii; ++i) {
			if (!this._hasState(otherStates[i])) {
				continue
			}
			var newState = this._findNoCollisionState(otherStates[i])
			this._renameState(otherStates[i], newState)
		}

		return true
	}


	// judge if a state exist
	Fragment.prototype._hasState = function (state) {
		return state in this.transitions
	}


	// Renames the state `from` to `to` and delete `from`
	// `to` must not exist
	Fragment.prototype._renameState = function (from, to) {
		var t = this.transitions[from]

		// @TODO I don't know why need the check if it is a private method
		if (t == null) {
			throw new Error('The state ' + from + ' does not exist')
		}

		delete this.transitions[from]
		this.transitions[to] = t

		// change the state table
		for (var k in this.transitions) {
			for (var i = 1, ii = this.transitions[k].length; i < ii; i += 2) {
				if (this.transitions[k][i] == from) {
					this.transitions[k][i] = to
				}
			}
		}

		// change init state
		if (this.initial == from) {
			this.initial = to
		}

		// change accept state
		for (var i = 0, ii = this.accept.length; i < ii; ++i) {
			if (this.accept[i] == from) {
				this.accept[i] = to
			}
		}
	}


	// find a state based `state` with no collision
	Fragment.prototype._findNoCollisionState = function (state) {
		while (this._hasState(state)) {
			state += '`'
		}
		return state
	}


	return Fragment
})


