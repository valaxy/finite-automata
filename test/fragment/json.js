define(function (require) {
	var Fragment = require('src/fragment')
	var regexpGenerate = require('src/regexp-generate')
	var union = require('src/fragment/union')


	test('json', function (assert) {
		// number = \d+
		var number = regexpGenerate.digit().repeatAtLeastOnce()

		// null
		var null_ = new Fragment('null')

		// bool
		var bool = union([new Fragment('true'), new Fragment('false')])

		// string = '"' .*? '"'

	})
})