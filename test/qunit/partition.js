define(function (require) {
	var Partition = require('../../src/partition')

	test('isSampeGroup()', function (assert) {
		var part1 = new Partition({
			'a': 0,
			'b': 1,
			'c': 5
		})

		assert.ok(part1.isSameGroup({
			'a': 0,
			'b': 1,
			'c': 5
		}))
		assert.ok(part1.isSameGroup({
			'b': 1,
			'c': 5,
			'a': 0
		}))
		assert.ok(!part1.isSameGroup({
			'a': 0,
			'b': 1
		}))
		assert.ok(!part1.isSameGroup({
			'a': 0,
			'b': 1,
			'c': 5,
			'd': 6
		}))
	})


	test('states()/addState()', function (assert) {
		var part1 = new Partition({
			'a': 0
		})

		assert.deepEqual(part1.states(), [])

		part1.addState('a')
		assert.deepEqual(part1.states(), ['a'])

		part1.addState('b', 'c')
		assert.deepEqual(part1.states(), ['a', 'b', 'c'])
	})


	test('toArray()', function (assert) {
		var part = new Partition({
			'a': 0,
			'b': 1
		}).addState('a', 'b', 'c')

		var array = part.toArray()
		assert.deepEqual(array[0], {
			a: 0,
			b: 1
		})
		assert.deepEqual(array.slice(1), ['a', 'b', 'c'])
	})

})