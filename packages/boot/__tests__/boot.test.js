'use strict';

const boot = require('..');
const assert = require('assert').strict;

assert.strictEqual(boot(), 'Hello from boot');
console.info('boot tests passed');
