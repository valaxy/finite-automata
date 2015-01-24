define(function (require) {
	var Fragment = require('../src/fragment')

	test('eof character', function (assert) {
		// Accepts the EOF character
		var fragment1 = new Fragment(-1)

		assert.ok(fragment1.test(-1), 'Should accept -1')
		assert.ok(!fragment1.test('ababba'), 'Should not accept ababba')
	})
})