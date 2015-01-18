(function (factory) {
	if (typeof exports === 'object') {
		var result = factory(require, exports, module)
		if (result) {
			module.exports = result
		}
	} else {
		define(factory)
	}
})(function (require) {
	var deepEqual = require('./deep-equal')

	function minimize(dfa) {
		// each element of groups is a array
		// the array contains states that are same which can be zipped into one state
		var groups = []
		var marks = [false, false] // two element???
		var stateToGroupMap = {}


		function buildStateToGroupMap() {
			stateToGroupMap = {}

			for (var i = 0, ii = groups.length; i < ii; ++i) { // @TODO why I can't use var i in groups
				var group = groups[i]

				for (var j = 0, jj = group.length; j < jj; j++) {
					stateToGroupMap[group[j]] = i
				}
			}
		}


		// return the i which marks[i] is false or -1
		function getUnmarkedIndex(marks) {
			for (var i in marks) {
				if (!marks[i]) {
					return i
				}
			}

			return -1
		}


		// 根据二维矩阵, 去掉了重复的状态, 返回不重复的状态
		// 有几个元素就有几个决然不相同的状态
		function partition(table) {
			var firstState = Object.keys(table)[0]

			// 是一个数组, 元素表示状态的集合, 这个集合里的状态是可以合并的状态
			//  元素: 这个状态的转换表, 状态1, 状态2, ...
			var subGroups = [[table[firstState], firstState]]

			delete table[firstState]

			for (var k in table) {
				var row = table[k]
				var found = false

				// 找到相同的状态, 指出边情况一致
				for (var j in subGroups) {
					if (deepEqual(row, subGroups[j][0])) {
						subGroups[j].push(k)
						found = true
						break
					}
				}

				if (!found) {
					subGroups.push([row, k])
				}
			}

			return subGroups
		}


		// 判断 states 里的状态是否一致
		// 一致则返回true, 否则返回false
		function isConsistent(states) {
			var table = {}

			if (states.length === 1) {
				return true
			}

			// 邻接表转化为table
			// table: 一维是状态, 二维是字母, 值是指向状态所属group-index
			// table contains all states of one group
			for (var i in states) {
				var state = states[i]
				var transitions = dfa.transitions[state]
				table[state] = {}

				for (var j = 0, jj = transitions.length; j < jj; j += 2) {
					table[state][transitions[j]] = stateToGroupMap[transitions[j + 1]]
				}
			}

			var partitions = partition(table)

			if (partitions.length === 1) { // 只有一个不重复的状态
				return true
			} else {
				return partitions // 返回这些状态
			}
		}


		// groups is a map array, map new state to old state
		// group[0] is about accept states
		// group[1] is about no-accept states
		groups[0] = dfa.accept // Accepting States
		groups[1] = []         // Rejecting states


		// put all the states to group[0] or group[1]
		for (var k in dfa.transitions) {
			if (groups[0].indexOf(k) < 0) {
				groups[1].push(k)
				stateToGroupMap[k] = 1
			} else {
				stateToGroupMap[k] = 0
			}
		}


		while (true) {
			var groupIndex = getUnmarkedIndex(marks)

			if (groupIndex < 0) {
				break
			}

			var partitions = isConsistent(groups[groupIndex])

			if (partitions === true) {
				marks[groupIndex] = true
			} else {
				groups.splice(groupIndex, 1) // delete the group

				for (var i = 0, ii = partitions.length; i < ii; ++i) {
					groups.push(partitions[i].slice(1)) // 只保留状态数组
				}

				buildStateToGroupMap()

				// Unmark everything again
				marks = new Array(groups.length)
				for (var i = 0, ii = marks.length; i < ii; ++i) {
					marks[i] = false
				}
			}
		}


		/*
		 * At this point we have the states put into equivalence classes
		 * now we just replace each state with it's group index, except
		 * for the accept states, which we use the same name for convenience
		 */

		// Map accept states back to themselves
		for (var i = 0, ii = dfa.accept.length; i < ii; ++i) {
			var state = dfa.accept[i]
			var groupIndex = stateToGroupMap[state]

			for (var k in stateToGroupMap) {
				if (stateToGroupMap[k] === groupIndex) {
					stateToGroupMap[k] = state
				}
			}
		}

		// stateToGroupMap has already been patched to map the accept states back to themselves
		// This replaces the initial state in case it was replaced
		dfa.initial = stateToGroupMap[dfa.initial]

		// Dedupe merged accept states
		var newAccept = []
		for (var i = 0, ii = dfa.accept.length; i < ii; ++i) {
			var temp = stateToGroupMap[dfa.accept[i]]

			if (newAccept.indexOf(temp) < 0) {
				newAccept.push(temp)
			}
		}

		dfa.accept = newAccept

		var newTransitions = {}
		var aliasMap = {}
		for (var state in dfa.transitions) {
			var groupIndex = stateToGroupMap[state]
			var stateLinks = []
			var transitions = dfa.transitions[state]

			for (var i = 0, ii = transitions.length; i < ii; i += 2) {
				stateLinks.push(transitions[i], stateToGroupMap[transitions[i + 1]])
			}

			// Since the groups are equivalent, we only need to add the transitions once
			// adding any more would just be adding duplicate transitions!
			if (newTransitions[groupIndex] == null) {
				newTransitions[groupIndex] = stateLinks
			}

			if (aliasMap[groupIndex] == null) {
				aliasMap[groupIndex] = dfa.aliasMap[state]
			} else {
				for (var i = 0, ii = dfa.aliasMap[state].length; i < ii; ++i) {
					var c = dfa.aliasMap[state][i]

					// Avoid duplicates in the alias map that can result from
					// dfa macrostates that share states getting merged together
					if (aliasMap[groupIndex].indexOf(c) < 0) {
						aliasMap[groupIndex].push(c)
					}
				}
			}
		}

		dfa.aliasMap = aliasMap
		dfa.transitions = newTransitions

		return dfa
	}

	return minimize
})

