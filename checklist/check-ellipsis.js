const SymbolChecker = require('../symbol-checker');
const ellipsisSymbols = require('../symbols/ellipsis');

const checker = new SymbolChecker('ellipsis', ellipsisSymbols);
module.exports = checker.check.bind(checker);
