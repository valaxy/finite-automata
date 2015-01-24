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
	var deepEqual = require('./deep-equal')

	// transferIndexes: if a char point out to a groupIndex
	// then record the index
	var Group = function (stateMark) {
		this._stateMark = stateMark
		this._states = []
	}

	// judge whether a state can join in
	Group.prototype.canJoin = function (otherStateMark) {
		return deepEqual(this._stateMark, otherStateMark)
	}

	Group.prototype.addState = function (state /* ... */) {
		for (var i in arguments) {
			var state = arguments[i]
			this._states.push(state)
		}
		return this
	}

	Group.prototype.addStates = function (states) {
		_.each(states, function (state) {
			this._states.push(state)
		}, this)
		return this
	}

	Group.prototype.states = function () {
		return this._states
	}

	Group.prototype.toArray = function () {
		var a = [this._stateMark]
		for (var i in this._states) {
			var state = this._states[i]
			a.push(state)
		}
		return a
	}

	Group.prototype.setMark = function (stateMark) {
		this._stateMark = stateMark
	}

	Group.prototype.contains = function (state) {
		return _.contains(this._states, state)
	}

	return Group
})