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
	var TransitionGraph = require('bower_components/graph/src/directed-transition-graph')

	/**
	 * initial: a string value
	 * accept: string array
	 * transitions: all must be a string
	 * @param def
	 * @constructor
	 */
	var Automata = function (def) {
		this._initial = def.initial
		this._accept = def.accept
		this._state = this._initial
		this._graph = TransitionGraph.fromJSON(def.transitions)
	}


	/**
	 * If current state is acceptable
	 */
	Automata.prototype.isAcceptState = function () {
		return _.contains(this._accept, this._state)
	}

	/**
	 * push a char to automata, change current state
	 * @returns {boolean} if arriveable return true else return false
	 */
	Automata.prototype.push = function (ch) {
		var nextState = this._graph.transfer(this._state, ch)
		if (!nextState) {
			return false
		} else {
			this._state = nextState
			return true
		}
	}


	/**
	 * if the state acceptable
	 * @param input
	 * @returns {boolean}
	 */
	Automata.prototype.accepts = function (input) {
		this.recover()

		for (var i in input) {
			if (!this.push(input[i])) {
				return false
			}
		}
		return this.isAcceptState()
	}


	/**
	 * change state to initial state, return this
	 */
	Automata.prototype.recover = function () {
		this._state = this._initial
		return this
	}


	return Automata
})


//Automata.EOF = -1


//// create a matrix
//Automata.prototype._createTable = function (transitions) {
//	// char is the column, state is the row
//	var fastTable = {}
//
//	for (var state in transitions) {
//		fastTable[state] = {}
//
//		for (var j = 0, jj = transitions[state].length; j < jj; j += 2) {
//			var chr = transitions[state][j]
//			fastTable[state][chr] = transitions[state][j + 1]
//		}
//	}
//
//	return fastTable
//}


//// EOF Testing is a special thing
//// @TODO why EOF test i special
//if (input === Automata.EOF) {
//	var row = this._table[this._state]
//	return row[Automata.EOF] != null && this._accept.indexOf(row[Automata.EOF]) > -1
//}