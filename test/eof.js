/* jshint evil:true */

var test = require('tape')
  , Fragment = require('./fragment/fragment')

test('eof character', function (t) {
  t.plan(2)

  // Accepts the EOF character
  var fragment1 = new Fragment(-1)

  t.ok(fragment1.test(-1), 'Should accept -1')
  t.ok(!fragment1.test('ababba'), 'Should not accept ababba')

})
