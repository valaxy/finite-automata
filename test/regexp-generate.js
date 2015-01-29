define(function (require) {
	var generate = require('src/regexp-generate')

	module('regexp-generate')

	test('alphanumeric()', function (assert) {
		var frag = generate.alphanumeric()

		assert.ok(frag.test('a'))
		assert.ok(frag.test('z'))
		assert.ok(frag.test('A'))
		assert.ok(frag.test('Z'))
		assert.ok(frag.test('_'))
		assert.ok(!frag.test('!'))
		assert.ok(!frag.test('aa'))
	})


	test('digit()', function (assert) {
		var frag = generate.digit()

		assert.ok(frag.test('0'))
		assert.ok(frag.test('9'))
		assert.ok(!frag.test('a'))
		assert.ok(!frag.test('01'))
	})


	test('unicode()', function (assert) {
		var frag = generate.unicode()

		assert.ok(frag.test('中'))
	})

})