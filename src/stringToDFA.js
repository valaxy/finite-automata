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

	// str: the string to match
	// acceptName: optional
	function stringToDFA(str, acceptName) {
		var acceptName = acceptName != undefined ? acceptName : (str.length + '')
		var transitions = {}

		for (var i = 0, ii = str.length - 1; i < ii; ++i) {
			var from = i + ''
			var to = (i + 1) + ''
			transitions[from] = [str[i], to]
		}
		if (str.length > 0) {
			transitions[i] = [str[i], acceptName]
			transitions[acceptName] = []
		}

		return {
			initial: '0',
			accept: [acceptName],
			transitions: transitions
		}
	}


	return stringToDFA
})