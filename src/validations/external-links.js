const isUrl = require('is-url');

module.exports = async externalLinks => {
  for (const externalLink of externalLinks) {
    if (!isUrl(externalLink)) {
      throw new Error('`--external-links`にURLではない値が含まれています');
    }
  }
}