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
  process._rawDebug(show(this));
}
function asyncBefore() {
}
function asyncAfter() {
}

net.connect(80, 'google.com', function () {

});

function show(obj) {
  var keys = Object.keys(obj);
  var data = '[' + obj.constructor.name + '] {\n';
  keys.forEach(function (k) {
    data += '  ' + k + ': ';
    if (k.slice(0, 2) === 'on') {
      data += '[event]';
    } else if (k === 'fd') {
      data += '[don\'t touch me]';
    } else if (k === 'callback') {
      data += '[callback]';
    } else {
      data += obj[k];
    }
    data += '\n';
  });
  return data + '}\n';
}
