var test = require('tape'),
	Fragment = require('../src/fragment')


test('Fragment:construction', function (assert) {
	assert.plan(1)

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


test('Fragment#_renameState()', function (assert) {
	assert.plan(3)

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


test('Fragment#_findNoCollisionState', function (assert) {
	assert.plan(2)

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


test('Fragment#_hasState()', function (assert) {
	assert.plan(2)

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


test('Fragment#_resolveCollisions()|states()', function (assert) {
	assert.plan(4)

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


test('Fragment#concat()', function (assert) {
	assert.plan(4)

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
	t.plan(1)

	var fragment = new Fragment('a', 'a').concat(new Fragment('b', 'b'))
		.concat(new Fragment('c', 'c'))

	t.deepEqual(fragment.toDfa().accept, ['c'], 'Accept state should keep label')
})


test('Fragment#union()', function (assert) {
	assert.plan(4)

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


test('Fragment#repeat()', function (assert) {
	assert.plan(10)

	// a*
	var frag = new Fragment({
		initial: 0,
		accept: [1],
		transitions: {
			0: ['a', 1],
			1: []
		}
	})

	frag.repeat()
	assert.ok(frag.test(''), 'Should accept empty string')
	assert.ok(frag.test('a'))
	assert.ok(frag.test('aaaa'))
	assert.ok(!frag.test('ba'))


	// (a|b)*
	var frag = new Fragment({
		initial: 0,
		accept: [1, 2],
		transitions: {
			0: ['a', 1, 'b', 2],
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


test('union state labels', function (t) {
	t.plan(1)

	var fragment = new Fragment('a', 'a').union(new Fragment('b', 'b'))
		.union(new Fragment('c', 'c'))

	t.deepEqual(fragment.toDfa().accept, ['a', 'b', 'c'], 'Accept states should keep labels')
})

test('kleene closure', function (t) {
	t.plan(6)

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

	t.ok(!fragment1.test(''), 'Concat+Repeat should not accept empty string')
	t.ok(!fragment1.test('a'), 'Concat+Repeat should not accept solely first dfa')
	t.ok(fragment1.test('b'), 'Concat+Repeat should accept solely second dfa')
	t.ok(fragment1.test('ab'), 'Concat+Repeat should accept concatenated dfa')
	t.ok(fragment1.test('aab'), 'Concat+Repeat should accept concatenated dfa with repeat')
	t.ok(fragment1.test('aaab'), 'Concat+Repeat should accept concatenated dfa with repeat')
})

test('kleene closure labels', function (t) {
	t.plan(1)

	var fragment = new Fragment('a', 'a').repeat()

	t.deepEqual(fragment.toDfa().accept, ['a'], 'Accept state should keep label')
})

test('(a|b)*c*(d|e)', function (t) {
	t.plan(11)

	var a = new Fragment({
			// Force a collision here
			initial: 'repeat`'
			, accept: ['q1']
			, transitions: {
				'repeat`': [
					'a', 'q1'
				]
				, q1: []
			}
		})
		, b = new Fragment({
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

	t.ok(!a.test(''), 'DFA should not accept empty string')
	t.ok(!a.test('f'), 'DFA should not accept f')
	t.ok(!a.test('abca'), 'DFA should not accept out of order a')
	t.ok(!a.test('abcad'), 'DFA should not accept out of order a')
	t.ok(!a.test('abcde'), 'DFA should not accept both d and e')
	t.ok(!a.test('aaccdd'), 'DFA should not accept second d')
	t.ok(a.test('ace'), 'DFA should accept ace')
	t.ok(a.test('abcd'), 'DFA should accept abcd')
	t.ok(a.test('aacd'), 'DFA should accept aacd')
	t.ok(a.test('aaccd'), 'DFA should accept aaccd')
	t.ok(a.test('aacce'), 'DFA should accept aacce')
})

test('cow(dog)*(cat)*', function (t) {
	t.plan(5)

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
