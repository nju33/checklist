const SymbolChecker = require('../symbol-checker');
const quoteSymbols = require('../symbols/quote');

const checker = new SymbolChecker('quote', quoteSymbols);
module.exports = checker.check.bind(checker);
