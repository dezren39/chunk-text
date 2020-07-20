#!/usr/bin/env node
const chunk = require('..');
console.log(chunk(process.argv[2], Number.parseInt(process.argv[3], 10), process.argv[4]));
