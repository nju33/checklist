const SymbolChecker = require('../symbol-checker');
const commaSymbols = require('../symbols/comma');

const checker = new SymbolChecker(commaSymbols);
module.exports = checker.check.bind(checker);

// module.exports = comma => async initPage => {
//   const page = await initPage();
//   const text = await page.$eval('body', el => el.innerText);
//   const filteredSymbols = commaSymbols.filter(symbol => symbol !== comma);

//   return !filteredSymbols.some(symbol => {
//     return text.includes(symbol);
//   });
// }