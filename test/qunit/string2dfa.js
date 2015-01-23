define(function (require) {
	var string2dfa = require('../../src/string2dfa'),
		Automata = require('../../src/automata'),
		Fragment = require('../../src/fragment')

	module('string2dfa')

	test('string2nfa', function (assert) {

		// empty string
		var automata = new Automata(string2dfa(''))
		assert.ok(automata.accepts(''))
		assert.ok(!automata.accepts('x'))

		// common
		automata = new Automata(string2dfa('abcd'))
		assert.ok(automata.accepts('abcd'))
		assert.ok(!automata.accepts('abc'))
		assert.ok(!automata.accepts('abcde'))
	})


	test('string2nfa', function (assert) {
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