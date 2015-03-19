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

function asyncInit() {
  this._start = Date.now();
  process._rawDebug(this.constructor.name + ': init');
}
function asyncBefore() {
  process._rawDebug(this.constructor.name +
    ': before [' + (Date.now() - this._start) + ' ms]');
}
function asyncAfter() {
  process._rawDebug(this.constructor.name +
    ': after [' + (Date.now() - this._start) + ' ms]');
}

var socket = net.connect(80, 'google.com', function () {
  socket.end();
});
