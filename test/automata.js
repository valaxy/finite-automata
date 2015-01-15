var test = require('tape'),
	Automata = require('../src/automata'),
	Fragment = require('../src/fragment')


test('Automata#accepts()', function (assert) {
	var machine = Automata.createFromFragment(new Fragment({
		initial: 0,
		accept: [3],
		transitions: {
			0: ['a', 1],
			1: ['b', 2],
			2: ['c', 3],
			3: []
		}
	}))

	assert.plan(2)
	assert.equal(machine.accepts('abc'), true)
	assert.equal(machine.accepts('ab'), false)
})


test('Automata#push()/isAcceptState()', function (assert) {
	var machine = Automata.createFromFragment(new Fragment({
		initial: 0,
		accept: [2],
		transitions: {
			0: ['a', 1],
			1: ['b', 2],
			2: []
		}
	}))

	assert.plan(6)
	assert.equal(machine.isAcceptState(), false)
	assert.equal(machine.push('a'), true)
	assert.equal(machine.isAcceptState(), false)
	assert.equal(machine.push('b'), true)
	assert.equal(machine.isAcceptState(), true)
	assert.equal(machine.push('c'), false)
})


