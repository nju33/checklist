const chalk = require('chalk');
const Table = require('cli-table3');

class Reporter {
  constructor() {
    Object.defineProperty(this, 'table', {
      value: new Table({
        head: ['項目', '結果']
      })
    });

    this.length = 0;
  }

  add(section, message) {
    this.table.push(
      [chalk.yellow(section), message]
    );

    this.length += 1;
  }

  hasMessage() {
    return this.length > 0;
  }

  message() {
    console.log(this.table.toString());
  }
}

module.exports = Reporter;