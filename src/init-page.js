const fs = require('fs-extra');
const isUrl = require('is-url');
const isRelativePath = require('is-relative-path');

module.exports = browser => filenameOrUrl => async (handler = {}) => {
  const page = await browser.newPage();

  if (handler.handleError) {
    page.on('error', err => {
      handler.handleError(err);
    });
  }

  if (handler.handlePageError)  {
    page.on('pageerror', err => {
      handler.handlePageError(err);
    });
  }

  if (isUrl(filenameOrUrl)) {
    const url = filenameOrUrl;
    await page.goto(url);
  } else {
    let filename = filenameOrUrl;
    if (isRelativePath(filename)) {
      filename = path.resolve(process.cwd(), filename);
    }
    const html = await fs.readFile(filename, 'utf-8');
    await page.setContent(html);
  }

  return page;
};