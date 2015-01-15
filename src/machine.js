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
	var StateMachine

	StateMachine = function StateMachine(def) {
		this._initial = def.initial
		this._accept = def.accept
		this._table = this._createTable(def.transitions)
	}

	StateMachine.prototype._createTable = function _createTable(transitions) {
		var k
			, j = 0
			, jj = 0
			, chr = ''
		// char is the column, state is the row
			, fastTable = {}

		for (k in transitions) {
			fastTable[k] = {}

			for (j = 0, jj = transitions[k].length; j < jj; j += 2) {
				chr = transitions[k][j]

				fastTable[k][chr] = transitions[k][j + 1]
			}
		}

		return fastTable
	}

// 恢复到初始状态
	StateMachine.prototype.recover = function () {
		this._state = this._initial
		return this
	}


// 如果通过ch的状态不可达则返回false, 否则返回true
	StateMachine.prototype.push = function (ch) {
		var nextState = this._table[this._state][ch]
		if (nextState === undefined) {
			return false
		} else {
			this._state = nextState
			return true
		}
	}


// 判断从初始状态开始的输入流是否可接受
	StateMachine.prototype.isAccept = function () {
		return this._accept.indexOf(this._state) >= 0
	}


	StateMachine.prototype.accepts = function exec(input) {

		this._state = this._initial

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

	return StateMachine
})


