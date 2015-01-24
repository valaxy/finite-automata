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
	var Group = require('./minimize/group')
	var Set = require('./set')
	var Graph = require('bower_components/graph/src/directed-transition-graph')


	// 将这个几个状态划分到不同的分组里去
	// stateMarks: 一个map, 表示状态对应的mark
	function getPartitionByStateMarks(stateMarks) {
		var subGroups = [] // 一个group表示一个分组

		_.each(stateMarks, function (stateMark, state) {
			var found = false

			// 找到这个状态所属的组
			for (var j in subGroups) {
				var subGroup = subGroups[j]
				if (subGroup.canJoin(stateMark)) {
					found = true
					break
				}
			}

			if (!found) { // 没有找到就另开一个组
				subGroups.push(new Group(stateMark).addState(state))
			} else {
				subGroup.addState(state)
			}
		})

		return subGroups
	}

	// states: 状态数组
	// 返回这些状态的划分, 一个包括Group的数组
	function getParitionByStates(group, dfaTransitions, stateToGroupMap) {
		var stateMarks = {}

		// 邻接表转化为邻接矩阵
		// table: 一维是状态, 二维是字母, 值是指向状态所属group-index
		// table contains all states of one group
		_.each(group.states(), function (state) {
			var transitions = dfaTransitions[state]
			stateMarks[state] = {}

			for (var j = 0, jj = transitions.length; j < jj; j += 2) {
				stateMarks[state][transitions[j]] = stateToGroupMap[transitions[j + 1]]
			}
		})

		var partition = getPartitionByStateMarks(stateMarks)
		return partition // 返回这些状态
	}


	function createUnmarkArray(length) {
		var marks = new Array(length)
		for (var i = 0, ii = marks.length; i < ii; ++i) {
			marks[i] = false
		}
		return marks
	}


	function buildStateToGroupMap(stateToGroupMap, groups) {
		for (var i = 0, ii = groups.length; i < ii; ++i) { // @TODO why I can't use var i in groups
			var group = groups[i].states()

			for (var j = 0, jj = group.length; j < jj; j++) {
				stateToGroupMap[group[j]] = i
			}
		}
	}


	// at the begin, accept states put in a group, others put other group
	function initPartition(stateToGroupMap, allStates, acceptStates) {
		// acceptGroup is about accept states
		// commonGroup is about no-accept states
		var acceptGroup = new Group().addStates(acceptStates)
		var otherGroup = new Group()

		// put all the states to acceptGroup or otherGroup
		_.each(allStates, function (state) {
			if (!acceptGroup.contains(state)) {
				otherGroup.addState(state)
				stateToGroupMap[state] = 1
			} else {
				stateToGroupMap[state] = 0
			}
		})
		return [acceptGroup, otherGroup]
	}


	function build_DFATONFA_AliasMap(originalMap, states, stateToGroupMap) {
		var aliasMap = {}
		_.each(states, function (state) {
			var newState = stateToGroupMap[state]

			if (!(newState in aliasMap)) {
				aliasMap[newState] = []
			}

			// nfa - dfa states
			_.each(originalMap[state], function (c) {
				// may contains same nfa-state
				if (aliasMap[newState].indexOf(c) < 0) {
					aliasMap[newState].push(c)
				}
			})
		})
		return aliasMap
	}


	function buildLastTransition(originalTransitions, stateToGroupMap) {
		//
		// 没有消除死状态啊
		//
		var newTransitions = {}
		for (var state in originalTransitions) {
			var newState = stateToGroupMap[state]
			if (newState in newTransitions) {
				continue
			}

			var transitions = originalTransitions[state]
			var stateLinks = []

			for (var i = 0, ii = transitions.length; i < ii; i += 2) {
				stateLinks.push(transitions[i], stateToGroupMap[transitions[i + 1]])
			}

			// Since the groups are equivalent, we only need to add the transitions once
			// adding any more would just be adding duplicate transitions!
			newTransitions[newState] = stateLinks
		}
		return newTransitions
	}


	function minimize(dfa) {
		var stateToGroupMap = {}
		var marks = createUnmarkArray(2) // for accept-states/common-states

		// each element of groups is a Group
		// the Group contains states that are same which can be zipped into one state
		var groups = initPartition(stateToGroupMap, Object.keys(dfa.transitions), dfa.accept)


		// 开始划分
		while (true) {
			var groupIndex = marks.indexOf(false) // 找到第一个没有被标识的分组
			if (groupIndex < 0) {
				break
			}

			// 针对groups[groupIndex]的一个内部分划
			var partition = getParitionByStates(groups[groupIndex], dfa.transitions, stateToGroupMap)

			if (partition.length === 1) {
				marks[groupIndex] = true
			} else {
				groups.splice(groupIndex, 1) // delete the group

				_.each(partition, function (group) {
					groups.push(group)
				})

				stateToGroupMap = {}
				buildStateToGroupMap(stateToGroupMap, groups)

				// unmark everything again
				marks = createUnmarkArray(groups.length)
			}
		}


		/*
		 * At this point we have the states put into equivalence classes
		 * now we just replace each state with it's group index, except
		 * for the accept states, which we use the same name for convenience
		 */

		// map accept states back to themselves
		_.each(dfa.accept, function (acceptState) {
			// 这里有一个问题就是: 假如有多个接受状态在一个组里
			// 那么, 它们的groupIndex相同
			// 虽然有多个接受状态会被处理,
			// 但所有状态对该groupIndex的指向最终会指向最后一个被处理的接受状态
			var groupIndex = stateToGroupMap[acceptState]

			for (var k in stateToGroupMap) {
				if (stateToGroupMap[k] === groupIndex) {
					stateToGroupMap[k] = acceptState
				}
			}
		})

		for (var state in stateToGroupMap) {
			stateToGroupMap[state] += '' // convert to string
		}


		// stateToGroupMap has already been patched to map the accept states back to themselves
		// This replaces the initial state in case it was replaced
		dfa.initial = stateToGroupMap[dfa.initial]


		// dedupe merged accept states
		var acceptStates = new Set
		_.each(dfa.accept, function (acceptState) {
			acceptStates.add(stateToGroupMap[acceptState])
		})

		dfa.accept = acceptStates.toArray()


		// build the last transition
		var newTransitions = buildLastTransition(dfa.transitions, stateToGroupMap)

		if (dfa.aliasMap) {
			dfa.aliasMap = build_DFATONFA_AliasMap(dfa.aliasMap, Object.keys(dfa.transitions), stateToGroupMap)
		} else { // no aliasMap
			dfa.aliasMap = null
		}
		dfa.transitions = newTransitions

		return dfa
	}

	minimize._initPartition = initPartition
	minimize._partition = getPartitionByStateMarks
	minimize._buildDFAToNFAMap = build_DFATONFA_AliasMap

	return minimize
})

