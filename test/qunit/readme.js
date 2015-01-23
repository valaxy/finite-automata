define(function (require) {
	var Fragment = require('../../src/fragment')

	test('readme demo', function (assert) {
		// Accepts "a"
		var fragment1 = new Fragment('a')

		// Accepts "b"
		var fragment2 = new Fragment('b')

		// Accepts "c"
		var fragment3 = new Fragment('c')

		// Equivalent to /(a|b)*c/
		// Which matches all strings containing only a and b that end with c
		fragment1.union(fragment2).repeat().concat(fragment3)

		assert.ok(fragment1.test('ababbc'), 'Should accept ababbc')
		assert.ok(!fragment1.test('ababba'), 'Should not accept ababba')
	})

})