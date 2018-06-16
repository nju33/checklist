const path = require('path');
const fs = require('fs-extra');
const isUrl = require('is-url');
const isRelativePath = require('is-relative-path');

module.exports = async filenameOrUrl => {
  if (isUrl(filenameOrUrl)) {
    return;
  }

  if (isRelativePath(filenameOrUrl)) {
    const relativePath = filenameOrUrl;
    const filename = path.resolve(process.cwd(), filenameOrUrl);
    const result = await fs.exists(filename);
    
    if (!result) {
      throw new Error(`存在しないファイル名です » ${filename}`);
    }
    return;
  }

  throw new Error('`[filename-of-url]`へは対象ファイルまでの相対パスまたは、URLを指定してください');
}