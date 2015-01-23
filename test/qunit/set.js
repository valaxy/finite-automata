define(function (require) {
	var Set = require('src/set')

	module('Set')

	test('add()/toArray()', function (assert) {
		var s = new Set
		assert.deepEqual(s.toArray(), [])

		assert.ok(s.add(1))
		assert.ok(!s.add(1))
		assert.deepEqual(s.toArray(), [1])

		assert.ok(s.add(2))
		assert.deepEqual(s.toArray(), [1, 2])

		assert.ok(s.canAdd(3))
		assert.ok(!s.canAdd(2))
	})
})