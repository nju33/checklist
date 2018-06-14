const chalk = require('chalk');

class Reporter {
  constructor() {
    this.label = '';
  }

  format(message) {
    let label = this.label;
    if (label !== '') {
      label = chalk.yellow(label);
    }

    return `${label} ${messsage}`
  }

  setLabel(label) {
    this.label = label;
  }

  removeLabel() {
    this.label = '';
  }

  showMessage(message) {
    this.format(message);
  }
}

module.exports = Reporter;