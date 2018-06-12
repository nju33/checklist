require('core-js/fn/string/includes');
const commaSymbols = require('../symbols/comma');

module.exports = comma => async initPage => {
  const page = await initPage();
  const text = await page.$eval('body', el => el.innerText);
  const filteredSymbols = commaSymbols.filter(symbol => symbol !== comma);

  return !filteredSymbols.some(symbol => {
    return text.includes(symbol);
  });
}