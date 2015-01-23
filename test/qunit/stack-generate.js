define(function (require) {
	var stackGenerate = require('src/stack-generate')

	module('stackGenerate')

	test('case', function (assert) {
		var result = [0]
		stackGenerate({
			initial: 0,
			next: function (x) {
				var a = []
				a.push(x + 1)
				return a
			},
			push: function (y) {
				if (y < 100) {
					result.push(y)
					return true
				} else {
					return false
				}
			}
		})

		assert.ok(true)
	})
})