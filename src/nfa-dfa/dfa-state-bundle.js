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

	var DFAStateBundle = function (nfaStates, delimiter) {
		this._nfaStates = nfaStates
		this._key = nfaStates.join(delimiter)
	}

	DFAStateBundle.prototype.key = function () {
		return this._key
	}

	DFAStateBundle.prototype.nfaStates = function () {
		return this._nfaStates
	}

	return DFAStateBundle

})