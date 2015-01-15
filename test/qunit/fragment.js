define(function (require) {
	var Fragment = require('../../src/fragment')

	QUnit.module('Fragment')

	QUnit.test('a case', function (assert) {
		var frag = new Fragment('1234')
		assert.equal(frag.test('1234'), true)
		assert.equal(frag.test('123'), false)
		assert.equal(frag.test('12345'), false)
	})
})