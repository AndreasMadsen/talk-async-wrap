'use strict';
var net = require('net');

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

var uid = 0;
function asyncInit() {
  this._uid = uid++
  process._rawDebug('async_wrap: init / ' + this._uid);
}
function asyncBefore() {
  process._rawDebug('async_wrap: before / ' + this._uid);
}
function asyncAfter() {
  process._rawDebug('async_wrap: after / ' + this._uid);
}

net.connect(80, 'google.com', function () {

});
