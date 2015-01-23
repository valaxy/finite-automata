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

	// 集合
	var Set = function () {
		this._ary = []
	}

	Set.prototype.add = function (ele) {
		for (var i = 0; i < this._ary.length; i++) {
			if (this._ary[i] === ele) {
				return false
			}
		}
		this._ary.push(ele)
		return true
	}

	Set.prototype.toArray = function () {
		return this._ary
	}

	Set.prototype.canAdd = function (ele) {
		for (var i = 0; i < this._ary.length; i++) {
			if (this._ary[i] === ele) {
				return false
			}
		}
		return true
	}

	return Set
})