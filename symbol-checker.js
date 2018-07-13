require('core-js/fn/string/includes');

class SymbolChecker {
  constructor(name, symbols) {
    this.name = name;
    this.symbols = symbols;
  }

  check(reporter) {
    return target => async initPage => {
      const page = await initPage();
      const text = await page.$eval('body', el => el.innerText);
      const filteredSymbols = this.symbols.filter(symbol => symbol !== target);

      const result = filteredSymbols.every(symbol => {
        return !text.includes(symbol);
      });

      if (!result) {
        const includesSymbols = filteredSymbols.filter(symbol => {
          return text.includes(symbol);
        });

        reporter.add(
          this.name,
          `「${target}」だけを期待しましたが、${includesSymbols.map(symbol => `「${symbol}」`).join(' ')}が含まれていました`
        );

        throw new Error();
      }

      return result;
    };
  }
}

module.exports = SymbolChecker;
