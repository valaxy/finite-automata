var test = require('tape'),
	StateMachine = require('./machine'),
	Fragment = require('./fragment')


test('StateMachine', function (assert) {
	assert.plan(10)

	var f = new Fragment({
		initial: 0,
		accept: [3],
		transitions: {
			0: ['a', 1],
			1: ['b', 2],
			2: ['c', 3],
			3: []
		}
	})
	var machine = new StateMachine(f.minimize())

	assert.equal(machine.accepts('abc'), true)
	assert.equal(machine.recover().accepts('ab'), false)

	machine.recover()
	assert.equal(machine.isAccept(), false)
	assert.equal(machine.push('a'), true)
	assert.equal(machine.isAccept(), false)
	assert.equal(machine.push('b'), true)
	assert.equal(machine.isAccept(), false)
	assert.equal(machine.push('c'), true)
	assert.equal(machine.isAccept(), true)
	assert.equal(machine.push('d'), false)
})


