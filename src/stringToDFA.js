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
		var acceptName = acceptName ? acceptName : str.length
		var transitions = {}

		for (var i = 0, ii = str.length - 1; i < ii; ++i) {
			transitions[i] = [str.charAt(i), i + 1]
		}
		transitions[i] = [str.charAt(i), acceptName]
		transitions[acceptName] = []

		return {
			initial: 0,
			accept: [acceptName],
			transitions: transitions
		}
	}


	return stringToDFA
})