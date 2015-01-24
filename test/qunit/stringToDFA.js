define(function (require) {
	var stringToDFA = require('src/stringToDFA'),
		Automata = require('src/automata')

	module('stringToDFA')

	test('empty string', function (assert) {
		var automata = new Automata(stringToDFA(''))
		assert.ok(automata.accepts(''))
		assert.ok(!automata.accepts('x'))
	})


	test('abcd', function (assert) {
		var automata = new Automata(stringToDFA('abcd'))
		assert.ok(automata.accepts('abcd'))
		assert.ok(!automata.accepts('abc'))
		assert.ok(!automata.accepts('abcde'))
	})


})