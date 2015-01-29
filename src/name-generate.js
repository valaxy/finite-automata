define(function () {

	var num = []

	var toString = function () {
		var s = ''
		for (var i = num.length - 1; i >= 0; i--) {
			s += String.fromCharCode(num[i])
		}
		return s
	}

	var generate = function () {
		var i = 0
		while (true) {
			if (i < num.length) {
				if (num[i] == 100) {
					num[i] = 1
					i++
				} else {
					num[i] += 1
					break
				}
			} else {
				num.push(1)
				break
			}
		}

		return toString()
	}

	return generate
})