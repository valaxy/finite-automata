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
	var Automata = function (def) {
		this._initial = def.initial
		this._accept = def.accept
		this._table = this._createTable(def.transitions)
		this.recover()
	}

	Automata.createFromFragment = function (frag) {
		return new Automata(frag.minimize())
	}

	Automata.prototype._createTable = function (transitions) {
		var chr = ''
			, fastTable = {} // char is the column, state is the row

		for (var k in transitions) {
			fastTable[k] = {}

			for (var j = 0, jj = transitions[k].length; j < jj; j += 2) {
				chr = transitions[k][j]

				fastTable[k][chr] = transitions[k][j + 1]
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
		if (input === -1) {
			return this._table[this._state][-1] != null &&
				this._accept.indexOf(this._table[this._state][-1]) > -1
		}

		var i = 0
			, ii = input.length
			, result = 0

		for (; i < ii; ++i) {
			result = this._table[this._state][input.charAt(i)]

			if (result === undefined) {
				return false
			}
			else {
				this._state = result
			}
		}

		return this._accept.indexOf(this._state) >= 0
	}

	return Automata
})

