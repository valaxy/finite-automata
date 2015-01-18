var test = require('tape'),
	Fragment = require('../../src/fragment')


test('json', function (assert) {
	// number = \d+
	var number = Fragment.createSingleNumber().repeatAtLeastOnce()

	// string = '"' .*? '"'

})