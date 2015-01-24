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
	function deepEqual(a, b) {
		if (Object.keys(a).length != Object.keys(b).length) {
			return false
		}

		for (var k in a) {
			if (a[k] !== b[k]) {
				return false
			}
		}

		return true
	}

	return deepEqual
})


