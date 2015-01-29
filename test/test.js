define(function (require) {
	require('./deep-equal')
	require('./stack-generate')

	require('./automata')

	require('./group')
	require('./minimize')

	require('./nfaToDFA')

	require('./stringToDFA')
	require('./fragment/union')
	require('./fragment')
	require('./fragment/repeat')
	require('./fragment/fragment')

	require('./name-generate')
	require('./regexp-generate')
	//require('./eof')
	//require('./errors')
	//require('./readme')

})