define(function (require) {
	var Fragment = require('src/fragment')

	module('Fragment')

	test('empty string', function (assert) {
		var frag = new Fragment('')
		assert.ok(frag.test(''), 'Should accept empty string')
	})

	
	test('1234', function (assert) {
		var frag = new Fragment('1234')
		assert.ok(frag.test('1234'))
		assert.ok(!frag.test('123'))
		assert.ok(!frag.test('12345'))
	})


	test('case1', function (assert) {
		// Example taken from:
		// http://binarysculpting.com/2012/02/15/converting-dfa-to-nfa-by-subset-construction-regular-expressions-part-2
		var nfa1 = new Fragment('abaa'),
			nfa2 = new Fragment('abcd', 'matched')

		assert.ok(!nfa1.test(''), 'Should not recognize empty string')
		assert.ok(!nfa1.test('aba'), 'Should not recognize wrong string')
		assert.ok(nfa1.test('abaa'), 'Should recognize the string')
		assert.ok(!nfa1.test('abaad'), 'Should not recognize wrong string')

		assert.ok(nfa2.test('abcd'), 'Should match string')
		assert.equal(nfa2.accept[0], 'matched', 'Should have token name')
	})
})