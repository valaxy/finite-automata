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

	var Partition = function (adjMatrix) {
		this._adjMatrix = adjMatrix // adjacent matrix
		this._states = []
	}

	Partition.prototype.isSameGroup = function (adjMatrix) {
		return deepEqual(this._adjMatrix, adjMatrix)
	}

	Partition.prototype.addState = function (state /* ... */) {
		for (var i in arguments) {
			var state = arguments[i]
			this._states.push(state)
		}
		return this
	}

	Partition.prototype.states = function () {
		return this._states
	}

	Partition.prototype.toArray = function () {
		var a = [this._adjMatrix]
		for (var i in this._states) {
			var state = this._states[i]
			a.push(state)
		}
		return a
	}

	return Partition
})