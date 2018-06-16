const SymbolChecker = require('../symbol-checker');
const quoteSymbols = require('../symbols/quote');

const checker = new SymbolChecker(quoteSymbols);
module.exports = checker.check.bind(checker);
