const SymbolChecker = require('../symbol-checker');
const percentSymbols = require('../symbols/percent');

const checker = new SymbolChecker(percentSymbols);
module.exports = checker.check.bind(checker);
