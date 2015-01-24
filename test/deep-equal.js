define(function (require) {
	var deepEqual = require('src/minimize/deep-equal')

	module('deepEqual')

	test('deepEqual()', function (assert) {
		assert.ok(deepEqual({a: 1, b: 2}, {a: 1, b: 2}))
		assert.ok(!deepEqual({a: 1}, {b: 1}))
		assert.ok(!deepEqual({a: 1}, {a: 1, b: 1}))
		assert.ok(!deepEqual({a: {a: 1}}, {a: {a: 1}}))
	})
})