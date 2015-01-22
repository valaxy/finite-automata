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
	var Group = require('./partition')
	var Set = require('./set')


	// table是邻接矩阵, 根据table, 去掉了重复的状态, 返回不重复的状态
	// 有几个元素就有几个决然不相同的状态
	// 划分组
	function partition(table) {
		// 随便找到一个状态
		var anyState = Object.keys(table)[0]

		// 是一个数组, 元素表示状态的集合, 这个集合里的状态是可以合并的状态
		//  元素: 这个状态的转换表, 状态1, 状态2, ...
		var anyGroup = new Group(table[anyState]).addState(anyState)
		var subGroups = [anyGroup]
		delete table[anyState]

		for (var state in table) {
			var row = table[state]
			var found = false

			// 找到相同的状态, 指出边情况一致
			for (var j in subGroups) {
				var group = subGroups[j]
				if (group.isSameGroup(row)) {
					group.addState(state)
					found = true
					break
				}
			}

			if (!found) {
				subGroups.push(new Group(row).addState(state))
			}
		}

		return subGroups
	}


	// return the i which marks[i] is false or -1
	function getUnmarkIndex(marks) {
		for (var i in marks) {
			if (!marks[i]) {
				return i
			}
		}

		return -1
	}


	function createUnmarkArray(length) {
		var marks = new Array(length)
		for (var i = 0, ii = marks.length; i < ii; ++i) {
			marks[i] = false
		}
		return marks
	}


	function copy(ary) {
		var a = new Array(ary.length)
		for (var i = 0; i < ary.length; i++) {
			a[i] = ary[i]
		}
		return a
	}


	function minimize(dfa) {

		function buildStateToGroupMap() {
			stateToGroupMap = {}

			for (var i = 0, ii = groups.length; i < ii; ++i) { // @TODO why I can't use var i in groups
				var group = groups[i]

				for (var j = 0, jj = group.length; j < jj; j++) {
					stateToGroupMap[group[j]] = i
				}
			}
		}


		// 判断 states 里的状态是否一致
		// 一致则返回true, 否则返回这个划分
		function isConsistent(states) {
			var table = {}

			// 如果这个分划只有一个状态, 那么这个分划一定是最终分划
			if (states.length === 1) {
				return true
			}

			// 邻接表转化为邻接矩阵
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

			// 获得了该分组的划分
			var partitions = partition(table)

			if (partitions.length === 1) { // 只有一个分组, 说明所有状态都可以放到这个组里
				return true
			} else {
				return partitions // 返回这些状态
			}
		}


		// each element of groups is a array
		// the array contains states that are same which can be zipped into one state
		var groups = []
		var marks = createUnmarkArray(2) // for accept-states/common-states
		var stateToGroupMap = {}


		// groups is a map array, map new state to old state
		// group[0] is about accept states
		// group[1] is about no-accept states
		groups[0] = copy(dfa.accept) // Accepting States, 这里只
		groups[1] = []               // Rejecting states


		// put all the states to group[0] or group[1]
		for (var state in dfa.transitions) {
			if (groups[0].indexOf(state) < 0) {
				groups[1].push(state)
				stateToGroupMap[state] = 1
			} else {
				stateToGroupMap[state] = 0
			}
		}


		while (true) {
			var groupIndex = getUnmarkIndex(marks)

			if (groupIndex < 0) {
				break
			}

			var partitions = isConsistent(groups[groupIndex])

			if (partitions === true) {
				marks[groupIndex] = true
			} else {
				groups.splice(groupIndex, 1) // delete the group

				for (var i in partitions) {
					groups.push(partitions[i].states())
				}

				buildStateToGroupMap()

				// Unmark everything again
				marks = createUnmarkArray(groups.length)
			}
		}


		/*
		 * At this point we have the states put into equivalence classes
		 * now we just replace each state with it's group index, except
		 * for the accept states, which we use the same name for convenience
		 */

		// Map accept states back to themselves
		for (var i in dfa.accept) {
			// 这里有一个问题就是: 假如有多个接受状态在一个组里
			// 那么, 它们的groupIndex相同
			// 虽然有多个接受状态会被处理,
			// 但所有状态对该groupIndex的指向最终会指向最后一个被处理的接受状态
			var acceptState = dfa.accept[i]
			var groupIndex = stateToGroupMap[acceptState]

			for (var k in stateToGroupMap) {
				if (stateToGroupMap[k] === groupIndex) {
					stateToGroupMap[k] = acceptState
				}
			}
		}

		// stateToGroupMap has already been patched to map the accept states back to themselves
		// This replaces the initial state in case it was replaced
		dfa.initial = stateToGroupMap[dfa.initial]

		// Dedupe merged accept states
		var newAcceptSet = new Set
		for (var i in dfa.accept) {
			var groupIndex = stateToGroupMap[dfa.accept[i]]
			newAcceptSet.add(groupIndex)
		}

		dfa.accept = newAcceptSet.toArray()


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

