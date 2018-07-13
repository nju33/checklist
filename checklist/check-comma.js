const SymbolChecker = require('../symbol-checker');
const commaSymbols = require('../symbols/comma');

const checker = new SymbolChecker('comma', commaSymbols);
module.exports = checker.check.bind(checker);