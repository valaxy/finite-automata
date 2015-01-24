define(function (require) {
	var Fragment = require('src/fragment')

	module('Fragment')

	test('repeat(): a*', function (assert) {
		var frag = new Fragment({
			initial: '0',
			accept: ['1'],
			transitions: {
				0: ['a', '1'],
				1: []
			}
		})

		frag.repeat()
		assert.ok(frag.test(''), 'Should accept empty string')
		assert.ok(frag.test('a'))
		assert.ok(frag.test('aaaa'))
		assert.ok(!frag.test('ba'))
	})


	test('repeat(): (a|b)*', function (assert) {
		var frag = new Fragment({
			initial: '0',
			accept: ['1', '2'],
			transitions: {
				0: ['a', '1', 'b', '2'],
				1: [],
				2: []
			}
		})

		frag.repeat()
		assert.ok(frag.test(''), 'Should accept empty string')
		assert.ok(frag.test('a'))
		assert.ok(frag.test('b'))
		assert.ok(frag.test('aaa'))
		assert.ok(frag.test('bbb'))
		assert.ok(frag.test('ababa'))
	})


})