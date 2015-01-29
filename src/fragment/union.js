define(function (require) {
	var Fragment = require('../fragment')
	var nameGenerate = require('../name-generate')

	var unionMany = function (frags) {
		if (frags.length == 0) {
			throw 'array cannot be empty'
		}

		// create a new fragment content
		var initial = nameGenerate()
		var transitions = {}
		var accept = []
		transitions[initial] = []

		// point new state to the others initial states with epsilon transitions
		for (var i in frags) {
			var frag = frags[i]
			transitions[initial].push('\0', frag.initial)

			// add all transitions from b to a
			for (var from in frag.transitions) {
				transitions[from] = frag.transitions[from]
			}

			// combine all accept states
			accept.push.apply(accept, frag.accept)
		}

		// create fragment
		return new Fragment({
			initial: initial,
			transitions: transitions,
			accept: accept
		})
	}


	// you should keep all the name are not same
	var union = function () {
		if (arguments.length == 1 && Array.isArray(arguments[0])) {
			return unionMany(arguments[0])
		} else {
			return arguments[0].union(arguments[1])
		}
	}

	return union
})