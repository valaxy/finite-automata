define(function (require) {
	var union = require('src/fragment/union')
	var Fragment = require('src/fragment')

	module('union()')

	test('case: length == 1', function (assert) {
		var a = new Fragment('a')
		var frag = union([a])
		assert.ok(frag.test('a'))
		assert.ok(!frag.test('b'))
		assert.ok(!frag.test(''))
	})

	test('case: length > 1', function (assert) {
		var a = new Fragment('a')
		var b = new Fragment('b')
		var c = new Fragment('c')
		var frag = union([a, b, c])
		assert.ok(frag.test('a'))
		assert.ok(frag.test('b'))
		assert.ok(frag.test('c'))
		assert.ok(!frag.test('d'))
		assert.ok(!frag.test('aa'))
		assert.ok(!frag.test(''))
	})
})