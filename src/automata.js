(function (factory) {
	if (typeof exports === 'object') {
		var result = factory(require, exports, module)
		if (result) {
			module.exports = result
		}
	} else {
		define(factory)
	}
})(function () {

	/**
	 * initial: xx
	 * accept: xx
	 * transitions: xx
	 * @param def
	 * @constructor
	 */
	var Automata = function (def) {
		this._initial = def.initial
		this._accept = def.accept
		this._table = this._createTable(def.transitions)
		this.recover()
	}

	Automata.EOF = -1


	// create a matix
	Automata.prototype._createTable = function (transitions) {
		// char is the column, state is the row
		var fastTable = {}

		for (var state in transitions) {
			fastTable[state] = {}

			for (var j = 0, jj = transitions[state].length; j < jj; j += 2) {
				var chr = transitions[state][j]
				fastTable[state][chr] = transitions[state][j + 1]
			}
		}

		return fastTable
	}


	/**
	 * change state to initial state, return this
	 */
	Automata.prototype.recover = function () {
		this._state = this._initial
		return this
	}


	/**
	 * push a char to automata, change current state
	 * @returns {boolean} if arriveable return true else return false
	 */
	Automata.prototype.push = function (ch) {
		var nextState = this._table[this._state][ch]
		if (nextState === undefined) {
			return false
		} else {
			this._state = nextState
			return true
		}
	}


	/**
	 * if current state is acceptable
	 * @returns {boolean}
	 */
	Automata.prototype.isAcceptState = function () {
		return this._accept.indexOf(this._state) >= 0
	}


	/**
	 * if the state acceptable
	 * @param input
	 * @returns {boolean}
	 */
	Automata.prototype.accepts = function (input) {
		this.recover()

		// EOF Testing is a special thing
		if (input === Automata.EOF) {
			return this._table[this._state][Automata.EOF] != null &&
				this._accept.indexOf(this._table[this._state][-1]) > -1
		}


		for (var i = 0, ii = input.length; i < ii; ++i) {
			var next = this._table[this._state][input.charAt(i)]

			if (next === undefined) {
				return false
			} else {
				this._state = next
			}
		}

		return this._accept.indexOf(this._state) >= 0
	}

	return Automata
})

