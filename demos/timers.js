'use strict';

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
function asyncBefore() {
  process._rawDebug('async_wrap: before');
}
function asyncAfter() {
  process._rawDebug('async_wrap: after');
}

process._rawDebug('user: before #1');
setTimeout(function () {
  process._rawDebug('user: done #1');
}, 3000);
process._rawDebug('user: after #1');

process._rawDebug('user: before #2');
setTimeout(function () {
  process._rawDebug('user: done #2');
}, 3000);
process._rawDebug('user: after #2');
