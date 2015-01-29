define(function (require) {
	var generate = require('src/name-generate')

	module('name-generate')

	test('generate', function (assert) {
		for (var i = 1; i <= 100; i++) {
			assert.equal(generate(), String.fromCharCode(i))
		}
		var st = generate()
		assert.equal(st.length, 2)
	})
})