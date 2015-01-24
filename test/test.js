define(function (require) {
	require('./set')
	require('./deep-equal')
	require('./stack-generate')

	require('./automata')

	require('./group')
	require('./minimize')

	require('./nfaToDFA')

	require('./stringToDFA')
	require('./fragment')
	require('./fragment/repeat')
	require('./fragment/fragment')


	//require('./eof')
	//require('./errors')
	//require('./readme')

})