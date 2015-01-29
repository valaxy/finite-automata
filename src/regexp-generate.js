define(function (require, exports) {
	var Fragment = require('./fragment')
	var union = require('src/fragment/union')

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
		var frags = []
		for (var i = 1; i <= 2000; i++) {
			var ch = String.fromCharCode(i)
			frags.push(new Fragment(ch))
		}
		return union(frags)
	}


	/** 1~256 */
	exports.ascii = function () {
		var frags = []
		for (var i = 1; i < 256; i++) {
			var ch = String.fromCharCode(i)
			frags.push(new Fragment(ch))
		}
		return union(frags)
	}


	/** 1~256 except `chs` */
	exports.asciiExcept = function (chs) {
		var frags = []
		for (var i = 1; i < 256; i++) {
			var ch = String.fromCharCode(i)
			if (!_.contains(chs, ch)) {
				frags.push(new Fragment(ch))
			}
		}
		return union(frags)
	}


	exports.dot = function () {

	}

	exports.dotExcept = function () {

	}
})