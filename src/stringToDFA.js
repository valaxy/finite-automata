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
	var nameGenerate = require('./name-generate')

	// str: the string to match
	// acceptName: optional
	function stringToDFA(str, acceptName) {
		//var acceptName = acceptName != undefined ? acceptName : (str.length + '')
		//var transitions = {}
		//
		//
		//var initial = nameGenerate()
		//var lastState = initial
		//for (var i = 0, ii = str.length - 1; i < ii; ++i) {
		//	var from = i + ''
		//	var to = (i + 1) + ''
		//	transitions[from] = [str[i], to]
		//}
		//if (str.length > 0) {
		//	transitions[i] = [str[i], acceptName]
		//	transitions[acceptName] = []
		//} else {
		//	transitions['0'] = []
		//}
		//
		//return {
		//	initial: '0',
		//	accept: [acceptName],
		//	transitions: transitions
		//}

		if (str.length == 0) {
			var initial = nameGenerate()
			var transitions = {}
			transitions[initial] = []
			return {
				initial: initial,
				accept: [initial],
				transitions: transitions
			}
		}

		var initial = nameGenerate()
		var acceptName = acceptName != undefined ? acceptName : nameGenerate()
		var transitions = {}

		var from = initial
		for (var i = 0, ii = str.length - 1; i < ii; ++i) {
			var to = nameGenerate()
			transitions[from] = [str[i], to]
			from = to
		}
		transitions[from] = [str[i], acceptName]
		transitions[acceptName] = []

		return {
			initial: initial,
			accept: [acceptName],
			transitions: transitions
		}
	}


	return stringToDFA
})