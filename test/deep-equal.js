var test = require('tape'),
	deepEqual = require('../src/deep-equal')


test('deepEqual()', function (assert) {
	assert.plan(4)
	assert.ok(deepEqual({a: 1, b: 2}, {a: 1, b: 2}))
	assert.ok(!deepEqual({a: 1}, {b: 1}))
	assert.ok(!deepEqual({a: 1}, {a: 1, b: 1}))
	assert.ok(!deepEqual({a: {a: 1}}, {a: {a: 1}}))
})