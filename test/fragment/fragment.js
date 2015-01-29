define(function (require) {
	var Fragment = require('src/fragment')

	module('Fragment')

	test('construction', function (assert) {
		var frag = new Fragment({
			initial: 'q0',
			accept: ['q2', 'q3'],
			transitions: {
				q0: [
					'\0', 'q1',
					'a', 'q2'
				],
				q1: [
					'b', 'q3'
				],
				q2: [
					'c', 'garbage'
				],
				q3: [],
				garbage: []
			}
		})

		assert.ok(frag)
	})


	test('_renameState()', function (assert) {
		var frag = new Fragment({
			initial: 0,
			accept: [0, 1],
			transitions: {
				0: ['a', 1, 'b', 0],
				1: ['c', 1, 'd', 0]
			}
		})

		frag._renameState(0, 5)
		assert.deepEqual(frag.transitions, {
			1: ['c', 1, 'd', 5],
			5: ['a', 1, 'b', 5]
		})
		assert.equal(frag.initial, 5)
		assert.deepEqual(frag.accept, [5, 1])
	})


	test('_findNoCollisionState', function (assert) {
		var frag = new Fragment({
			initial: 0,
			accept: [1],
			transitions: {
				0: ['a', 1],
				1: []
			}
		})

		assert.equal(frag._findNoCollisionState(0), '0`')
		assert.equal(frag._findNoCollisionState(2), 2)
	})


	test('_hasState()', function (assert) {
		var frag = new Fragment({
			initial: 0,
			accept: [0],
			transitions: {
				0: ['a', 0]
			}
		})

		assert.ok(frag._hasState(0))
		assert.ok(!frag._hasState(1))
	})


	test('_resolveCollisions()|states()', function (assert) {
		// q0 - "a" -> q1
		var fragment1 = new Fragment({
				initial: 'q0',
				accept: ['q1'],
				transitions: {
					q0: ['a', 'q1'],
					q1: []
				}
			}),
			fragment2 = new Fragment({
				initial: 'q0',
				accept: ['q1'],
				transitions: {
					q0: ['b', 'q1'],
					q1: []
				}
			})

		// if change the rename strategy, all the cases need to be change
		fragment2._resolveCollisions(fragment1)
		assert.deepEqual(fragment2.states(), ['q0`', 'q1`'], 'Should resolve initial collision with a `')

		fragment2._resolveCollisions(fragment2)
		assert.deepEqual(fragment2.states(), ['q0``', 'q1``'], 'Should resolve second collision with ``')

		fragment2._resolveCollisions(fragment2)
		assert.deepEqual(fragment2.states(), ['q0```', 'q1```'], 'Should resolve third collision with ```')

		fragment2._resolveCollisions(fragment2)
		assert.deepEqual(fragment2.states(), ['q0````', 'q1````'], 'Should resolve fourth collision with ````')
	})


	test('concat()', function (assert) {
		// q0 - "a" -> q1
		var fragment1 = new Fragment({
				initial: 'q0',
				accept: ['q1'],
				transitions: {
					q0: [
						'a', 'q1'
					],
					q1: []
				}
			}),
			fragment2 = new Fragment({
				initial: 'q0',
				accept: ['q1'],
				transitions: {
					q0: [
						'b', 'q1'
					],
					q1: []
				}
			})

		fragment1.concat(fragment2)

		assert.ok(!fragment1.test('a'), 'Concat should not accept solely first dfa')
		assert.ok(!fragment1.test('b'), 'Concat should not accept solely second dfa')
		assert.ok(fragment1.test('ab'), 'Concat should accept complete dfa')
		assert.ok(!fragment1.test('abc'), 'Concat should not accept overflown dfa')
	})


	test('concat state labels', function (t) {
		var fragment = new Fragment('a', 'a').concat(new Fragment('b', 'b'))
			.concat(new Fragment('c', 'c'))

		t.deepEqual(fragment.toDfa().accept, ['c'], 'Accept state should keep label')
	})


	test('union()', function (assert) {
		var fragment1 = new Fragment({
				initial: 'union`', // force a collision
				accept: ['q1'],
				transitions: {
					'union`': [
						'a', 'q1'
					],
					q1: []
				}
			}),
			fragment2 = new Fragment({
				initial: 'union`', // force a collision
				accept: ['q1'],
				transitions: {
					'union`': [
						'b', 'q1'
					],
					q1: []
				}
			})

		fragment1.union(fragment2)

		assert.ok(!fragment1.test(''), 'Union should not accept empty string')
		assert.ok(fragment1.test('a'), 'Union should accept solely first dfa')
		assert.ok(fragment1.test('b'), 'Union should accept solely second dfa')
		assert.ok(!fragment1.test('ab'), 'Union should not accept concatenated dfa')
	})


	test('repeatAtleastOnce()', function (assert) {
		var frag = new Fragment('ab')
		frag.repeatAtLeastOnce()

		assert.ok(frag.test('ab'))
		assert.ok(frag.test('abab'))
		assert.ok(!frag.test(''))
	})


	test('union state labels', function (t) {
		var fragment = new Fragment('a', 'a').union(new Fragment('b', 'b'))
			.union(new Fragment('c', 'c'))

		t.deepEqual(fragment.toDfa().accept, ['a', 'b', 'c'], 'Accept states should keep labels')
	})


	test('kleene closure', function (assert) {
		var fragment1 = new Fragment({
				initial: 'repeat`'
				, accept: ['q1']
				, transitions: {
					// Force a collision
					'repeat`': [
						'a', 'q1'
					]
					, q1: []
				}
			})
			, fragment2 = new Fragment({
				initial: 'q0'
				, accept: ['q1']
				, transitions: {
					q0: [
						'b', 'q1'
					]
					, q1: []
				}
			})

		fragment1.repeat().concat(fragment2)

		assert.ok(!fragment1.test(''), 'Concat+Repeat should not accept empty string')
		assert.ok(!fragment1.test('a'), 'Concat+Repeat should not accept solely first dfa')
		assert.ok(fragment1.test('b'), 'Concat+Repeat should accept solely second dfa')
		assert.ok(fragment1.test('ab'), 'Concat+Repeat should accept concatenated dfa')
		assert.ok(fragment1.test('aab'), 'Concat+Repeat should accept concatenated dfa with repeat')
		assert.ok(fragment1.test('aaab'), 'Concat+Repeat should accept concatenated dfa with repeat')
	})


	test('kleene closure labels', function (assert) {
		var fragment = new Fragment('a', 'a').repeat()
		assert.deepEqual(fragment.toDfa().accept, ['a'], 'Accept state should keep label')
	})


	test('(a|b)*c*(d|e)', function (assert) {
		var a = new Fragment({
				// Force a collision here
				initial: 'repeat`',
				accept: ['q1'],
				transitions: {
					'repeat`': ['a', 'q1'],
					q1: []
				}
			}),
			b = new Fragment({
				initial: 'q0'
				, accept: ['q1']
				, transitions: {
					q0: [
						'b', 'q1'
					]
					, q1: []
				}
			})
			, c = new Fragment({
				initial: 'q0'
				, accept: ['q1']
				, transitions: {
					q0: [
						'c', 'q1'
					]
					, q1: []
				}
			})
			, d = new Fragment({
				initial: 'q0'
				, accept: ['q1']
				, transitions: {
					q0: [
						'd', 'q1'
					]
					, q1: []
				}
			})
			, e = new Fragment({
				initial: 'q0'
				, accept: ['q1']
				, transitions: {
					q0: [
						'e', 'q1'
					]
					, q1: []
				}
			})

		// WOAAAH?
		a.union(b).repeat().concat(c.repeat()).concat(d.union(e))

		assert.ok(!a.test(''), 'DFA should not accept empty string')
		assert.ok(!a.test('f'), 'DFA should not accept f')
		assert.ok(!a.test('abca'), 'DFA should not accept out of order a')
		assert.ok(!a.test('abcad'), 'DFA should not accept out of order a')
		assert.ok(!a.test('abcde'), 'DFA should not accept both d and e')
		assert.ok(!a.test('aaccdd'), 'DFA should not accept second d')
		assert.ok(a.test('ace'), 'DFA should accept ace')
		assert.ok(a.test('abcd'), 'DFA should accept abcd')
		assert.ok(a.test('aacd'), 'DFA should accept aacd')
		assert.ok(a.test('aaccd'), 'DFA should accept aaccd')
		assert.ok(a.test('aacce'), 'DFA should accept aacce')
	})


	test('cow(dog)*(cat)*', function (t) {
		var nfa = new Fragment('cow', 'cow')
			, dog = new Fragment('dog', 'cowdog')
			, cat = new Fragment('cat', 'cowdogcat')

		// Match cow followed by any number of dogs then any number of cats
		nfa.concat(dog.repeat()).concat(cat.repeat())

		t.ok(nfa.test('cow'))
		t.ok(nfa.test('cowdog'))
		t.ok(nfa.test('cowdogcat'))
		t.ok(nfa.test('cowcat'))
		t.ok(nfa.test('cowdogcatcat'))
	})


})