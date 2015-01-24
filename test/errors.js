define(function (require) {
	var Fragment = require('src/fragment')

	test('errors', function (assert) {
		assert.throws(function () {
			new Fragment()
		}, 'Fragment needs a definition')

		assert.throws(function () {
			new Fragment({})
		}, 'Fragment needs an initial state')

		assert.throws(function () {
			new Fragment({initial: 'a'})
		}, 'Fragment must have an array of accepted states')

		assert.throws(function () {
			new Fragment({initial: 'a', accept: []})
		}, 'Fragment must have a map of transitions')

		assert.throws(function () {
			new Fragment({initial: 'a', accept: ['q'], transitions: {}})
		}, 'Accept state "q" does not exist in the transition map')

		assert.throws(function () {
			new Fragment({initial: 'a', accept: ['q'], transitions: {q: 3}})
		}, 'The transitions for q must be an array')

		assert.throws(function () {
			new Fragment({initial: 'a', accept: ['q'], transitions: {q: ['a', 'f']}})
		}, 'Transitioned to f, which does not exist in the transition map')

		assert.throws(function () {
			var a = new Fragment({initial: 'a', accept: ['q'], transitions: {q: []}})
			a._renameState('b', 'k')
		}, 'The state b does not exist')

		var a = new Fragment({initial: 'a', accept: ['q'], transitions: {q: []}})
		assert.equal(a.toDfa('q').toString(), 'Error: Delimiter "q" collision in state "q"')
	})
})