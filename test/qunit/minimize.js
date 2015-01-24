define(function (require) {
	var Fragment = require('src/fragment')
	var Automata = require('src/automata')
	var minimize = require('src/minimize')
	var Graph = require('bower_components/graph/src/directed-linked-graph')

	module('minimize')

	var transitionToGraph = function (transition) {
		var graph = new Graph
		for (var state in transition) {
			var trans = transition[state]
			for (var i = 0; i < trans.length; i += 2) {
				var edge = trans[i]
				var nextState = trans[i + 1]
				graph.addEdge(state, nextState, edge)
			}
		}
		return graph
	}


	test('_partition()', function (assert) {
		var stateMarks = {
			'x': {'a': 0, 'b': 1, 'c': 2},
			'y': {'a': 0, 'b': 1, 'c': 2},
			'z': {'a': 0, 'b': 0, 'c': 1}
		}
		var subGroups = minimize._partition(stateMarks)
		assert.deepEqual(subGroups[0].states(), ['x', 'y'])
		assert.deepEqual(subGroups[1].states(), ['z'])
	})


	test('_initPartition', function (assert) {
		var map = {}
		var groups = minimize._initPartition(map, ['0', '1', '2', '3', '4'], ['1', '3'])
		assert.deepEqual(groups[0].states(), ['1', '3'])
		assert.deepEqual(groups[1].states(), ['0', '2', '4'])
		assert.deepEqual(map, {
			'0': 1,
			'1': 0,
			'2': 1,
			'3': 0,
			'4': 1
		})
	})


	test('example comes from《编译原理》3.9.6 section', function (assert) {
		// before minimize
		var def = {
			initial: 'A',
			accept: ['E'],
			transitions: {
				A: ['a', 'B', 'b', 'C'],
				B: ['a', 'B', 'b', 'D'],
				C: ['a', 'B', 'b', 'C'],
				D: ['a', 'B', 'b', 'E'],
				E: ['b', 'C', 'a', 'B']
			},
			aliasMap: {} // fake
		}
		var graph1 = transitionToGraph(def.transitions)

		// after minimize
		var def = minimize(def)
		var graph2 = transitionToGraph(def.transitions)

		// the end graph
		var graph3 = new Graph
		graph3.addEdge('123', '123', 'b')
		graph3.addEdge('123', '1234', 'a')
		graph3.addEdge('1234', '1234', 'a')
		graph3.addEdge('1234', '1235', 'b')
		graph3.addEdge('1235', '1234', 'a')
		graph3.addEdge('1235', '1236', 'b')
		graph3.addEdge('1236', '1234', 'a')
		graph3.addEdge('1236', '123', 'b')

		assert.ok(graph2.isostructural(graph3))
		assert.ok(!graph1.isostructural(graph3))
	})

	test('minimize a dfa', function (assert) {
		var dfa = new Fragment({
			initial: '0',
			accept: ['0', 'pancake'],
			transitions: {
				0: ['a', '1'],
				1: ['a', '4', 'b', '2'],
				2: ['a', '3', 'b', '5'],
				3: ['b', '1'],
				4: ['a', 'pancake', 'b', '5'],
				5: ['a', '7', 'b', '2'],
				pancake: ['a', '5'],
				7: ['a', '0', 'b', '5']
			}
		})
		var minimalDfa = dfa.minimize(',')
		var dfa = new Fragment(minimalDfa)
		var automata = new Automata(minimalDfa)

		assert.ok(automata.accepts('abbbabaa'), 'nfa should accept abbbabaa')
		assert.ok(automata.accepts('aaa'), 'nfa should accept aaa')
		assert.ok(automata.accepts(''), 'nfa should accept empty string')
		assert.ok(!automata.accepts('a'), 'nfa should accept a')

		assert.ok(automata.accepts('abbbabaa'), 'minimal dfa should accept abbbabaa')
		assert.ok(automata.accepts('aaa'), 'minimal dfa should accept aaa')
		assert.ok(automata.accepts(''), 'minimal dfa should accept empty string')
		assert.ok(!automata.accepts('a'), 'minimal dfa should accept a')

		//assert.equal(minimalDfa.initial, 'pancake', 'Should have preserved initial state')
		//assert.deepEqual(minimalDfa.accept, ['pancake'], 'Should have preserved accept state')
		//assert.deepEqual(dfa.transitions, {
		//	'1': ['b', '3'],
		//	'2': ['a', 'pancake', 'b', '3'],
		//	'3': ['a', '2', 'b', '4'],
		//	'4': ['a', '1', 'b', '3'],
		//	pancake: ['a', '3']
		//}, 'Transitions should be remapped with accept state preserved')
	})


	test('case1', function (assert) {
		var nfa = new Fragment({
			initial: 'A'
			, accept: ['C']
			, transitions: {
				A: ['\x00', 'B', 'a', 'C']
				, B: ['a', 'C']
				, C: []
			}
		})

		minimalDfa = nfa.minimize(',')
		dfa = new Fragment(minimalDfa)

		assert.ok(dfa.test('a'), 'minimal dfa should accept a')
		assert.ok(!dfa.test('b'), 'minimal dfa should not accept b')
		assert.ok(!dfa.test('aa'), 'minimal dfa should not accept aa')
		assert.deepEqual(minimalDfa.aliasMap, {'1': ['A', 'B'], C: ['C']}
			, 'aliasMap should survive the nfa -> dfa -> minimization process')
	})


	//test('a case', function (assert) {
	//var nfa = new Fragment({
	//	initial: 'A|D|F|H|L|M',
	//	accept: ['E', 'G', 'F|H|I|L|M', 'L|M|N', 'O', 'K', 'C'],
	//	transitions: {
	//		'A|D|F|H|L|M': ['T\'', 'B', 'T', 'E', 'R', 'G', 'a', 'F|H|I|L|M', 'b', 'L|M|N'],
	//		'L|M|N': ['b', 'L|M|N', 'R', 'O'],
	//		O: [],
	//		'F|H|I|L|M': ['R', 'G', 'a', 'F|H|I|L|M', 'T', 'J', 'b', 'L|M|N'],
	//		J: ['c', 'K'],
	//		K: [],
	//		G: [],
	//		E: [],
	//		B: [-1, 'C'],
	//		C: []
	//	},
	//	aliasMap: {
	//		'A|D|F|H|L|M': ['A', 'D', 'F', 'H', 'L', 'M'],
	//		'L|M|N': ['L', 'M', 'N'],
	//		O: ['O'],
	//		'F|H|I|L|M': ['F', 'H', 'I', 'L', 'M'],
	//		J: ['J'],
	//		K: ['K'],
	//		G: ['G'],
	//		E: ['E'],
	//		B: ['B'],
	//		C: ['C']
	//	}
	//})
	//
	//var minimalDfa = nfa.minimize(',')
	//
	//assert.deepEqual(minimalDfa, {
	//	initial: 3,
	//	accept: ['C', 'F|H|I|L|M', 'L|M|N'],
	//	transitions: {
	//		'3': ['T\'', 5, 'T', 'C', 'R', 'C', 'a', 'F|H|I|L|M', 'b', 'L|M|N'],
	//		'4': ['c', 'C'],
	//		'5': [-1, 'C'],
	//		'L|M|N': ['b', 'L|M|N', 'R', 'C'],
	//		'C': [],
	//		'F|H|I|L|M': ['R', 'C', 'a', 'F|H|I|L|M', 'T', 4, 'b', 'L|M|N']
	//	},
	//	aliasMap: {
	//		'3': ['A|D|F|H|L|M'],
	//		'4': ['J'],
	//		'5': ['B'],
	//		'L|M|N': ['L|M|N'],
	//		'C': ['O', 'K', 'G', 'E', 'C'],
	//		'F|H|I|L|M': ['F|H|I|L|M']
	//	}
	//}, 'The aliasMap should correctly merge macrostates from the nfa->dfa stage')
	//})
})