var test = require('tape'),
	Automata = require('../src/automata')

test('Automata#accepts()', function (assert) {
	assert.plan(4)

	// abc
	var machine = new Automata({
		initial: 0,
		accept: [3],
		transitions: {
			0: ['a', 1],
			1: ['b', 2],
			2: ['c', 3],
			3: []
		}
	})

	assert.equal(machine.accepts('abc'), true)
	assert.equal(machine.accepts('ab'), false)
	assert.equal(machine.accepts(''), false)

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


test('Automata#push()/isAcceptState()', function (assert) {
	var machine = new Automata({
		initial: 0,
		accept: [2],
		transitions: {
			0: ['a', 1],
			1: ['b', 2],
			2: []
		}
	})

	assert.plan(6)
	assert.equal(machine.isAcceptState(), false)
	assert.equal(machine.push('a'), true)
	assert.equal(machine.isAcceptState(), false)
	assert.equal(machine.push('b'), true)
	assert.equal(machine.isAcceptState(), true)
	assert.equal(machine.push('c'), false)
})


