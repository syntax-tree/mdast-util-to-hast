// Dependencies:
var inspect = require('unist-util-inspect');
var remark = require('remark');
var toHAST = require('./index.js');

// Transform:
var hast = toHAST(remark().parse('## Hello **World**!'));

// Yields:
console.log('txt', inspect.noColor(hast));
