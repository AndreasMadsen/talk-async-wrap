'use strict';
var fs = require('fs');

// Right now async_wrap is an internal C++ module,
// thus require doesn't work.

var asyncWrap = process.binding('async_wrap');

// Think of `CallInitHook` as the property name
// and `kCallInitHook` as the way to access it
var kCallInitHook = 0;
var asyncHooksObject = {};

// Enable async wrap
asyncWrap.setupHooks(asyncHooksObject,
    asyncInit, asyncBefore, asyncAfter);

// Enable init events (default 0)
// Must be set after `async_wrap.setupHooks` is called
asyncHooksObject[kCallInitHook] = 1;

function asyncInit() {
  console.log('async_wrap: init');
}
function asyncBefore() {
  console.log('async_wrap: before');
}
function asyncAfter() {
  console.log('async_wrap: after');
}

console.log('user: before');
fs.open(__filename, 'r', function (err, fd) {
  console.log('user: done');
});
console.log('user: after');
