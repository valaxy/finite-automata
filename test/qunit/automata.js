define(function (require) {
	var Automata = require('../../src/automata')

	module('Automata')

	test('isAcceptState()', function (assert) {
		var automata = new Automata({
			initial: '0',
			accept: ['0'],
			transitions: {
				'0': []
			}
		})
		assert.ok(automata.isAcceptState())

		automata = new Automata({
			initial: '0',
			accept: ['1'],
			transitions: {
				'0': [],
				'1': []
			}
		})
		assert.ok(!automata.isAcceptState())
	})

	test('push()', function (assert) {
		var automata = new Automata({
			initial: '0',
			accept: ['2'],
			transitions: {
				'0': ['a', '1'],
				'1': ['b', '2'],
				'2': []
			}
		})

		assert.equal(automata.isAcceptState(), false)
		assert.equal(automata.push('a'), true)
		assert.equal(automata.isAcceptState(), false)
		assert.equal(automata.push('b'), true)
		assert.equal(automata.isAcceptState(), true)
		assert.equal(automata.push('c'), false)
	})


	test('recover()', function (assert) {
		var automata = new Automata({
			initial: '0',
			accept: ['1'],
			transitions: {
				'0': ['a', '1'],
				'1': []
			}
		})

		assert.ok(!automata.isAcceptState())
		assert.ok(automata.push('a'))
		assert.ok(automata.isAcceptState())
		automata.recover()
		assert.ok(!automata.isAcceptState())
	})


	test('accepts()', function (assert) {
		// abc
		var automata = new Automata({
			initial: '0',
			accept: ['3'],
			transitions: {
				0: ['a', '1'],
				1: ['b', '2'],
				2: ['c', '3'],
				3: []
			}
		})

		assert.equal(automata.accepts('abc'), true)
		assert.equal(automata.accepts('ab'), false)
		assert.equal(automata.accepts(''), false)
		assert.equal(automata.accepts('abcd'), false)

		// empty string
		var machine = new Automata({
			initial: 0,
			accept: [0],
			transitions: {
				0: [],
				1: ['a', 0]
			}
		})

		assert.equal(machine.accepts(''), true)
	})


})



