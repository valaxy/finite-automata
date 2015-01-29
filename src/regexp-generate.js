define(function (require, exports) {
	var Fragment = require('./fragment')

	/** \w */
	exports.alphanumeric = function () {
		var frag = new Fragment('_')
		for (var i = 0; i < 26; i++) {
			var ch = String.fromCharCode(97 + i)
			frag.union(new Fragment(ch))

			ch = String.fromCharCode(65 + i)
			frag.union(new Fragment(ch))
		}
		return frag
	}


	/** \d */
	exports.digit = function () {
		var frag = new Fragment('0')
		for (var i = 1; i < 10; i++) {
			var ch = i + ''
			frag.union(new Fragment(ch))
		}
		return frag
	}


	/** 1~65536 */
	exports.unicode = function () {
		var frag = new Fragment('\u0001')
		for (var i = 2; i <= 10000; i++) {
			console.log(i)
			var ch = String.fromCharCode(i)
			frag.union(new Fragment(ch))
		}
		return frag
	}

})