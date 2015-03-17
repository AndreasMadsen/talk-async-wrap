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
  process._rawDebug('async_wrap: init');
}

var catchError = false;
function asyncBefore() {
  catchError = true;
  process._rawDebug('async_wrap: before');
}
function asyncAfter() {
  catchError = false;
  process._rawDebug('async_wrap: after');
}
var old = process._fatalException;
process._fatalException = function (error){
  if (catchError)
  error.stack = 'Mutate' + error.stack;
  old.apply(process, arguments);
};

fs.open(__filename, 'r', function () {
  throw new Error('ups');
});
