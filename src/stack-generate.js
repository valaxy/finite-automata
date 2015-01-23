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

	var empty = function () {
		// nothing
	}

	var stackGenerate = function (options) {
		var initial = options.initial
		var next = options.next
		var push = options.push || empty
		var pop = options.pop || empty

		var stack = [].concat(initial)
		while (stack.length > 0) {
			var x = stack.pop()
			pop(x)

			var nexts = next(x)
			for (var i in nexts) {
				var y = nexts[i]
				if (push(y)) {
					stack.push(y)
				}
			}
		}
	}

	return stackGenerate
})