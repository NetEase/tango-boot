'use strict';

const request = require('..');
const assert = require('assert').strict;

assert.strictEqual(request(), 'Hello from request');
console.info('request tests passed');
