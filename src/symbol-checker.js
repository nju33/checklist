require('core-js/fn/string/includes');

class SymbolChecker {
  constructor(symbols) {
    this.symbols = symbols;
  }

  check(target) {
    return async initPage => {
      const page = await initPage();
      const text = await page.$eval('body', el => el.innerText);
      const filteredSymbols = this.symbols.filter(symbol => symbol !== target);
    
      return filteredSymbols.every(symbol => {
        return !text.includes(symbol);
      });
    };
  }
}

module.exports = SymbolChecker;