define(function (require) {
	var minimize = require('src/minimize'),
		Graph = require('bower_components/graph/src/directed-linked-graph')

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

	module('minimize')

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

})