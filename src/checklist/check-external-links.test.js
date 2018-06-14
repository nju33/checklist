const fs = require('fs-extra');
const puppeteer = require('puppeteer');
const checkExternalLinks = require('./check-external-links');

describe('check-links', () => {
  let browser;
  let checker = checkExternalLinks(['https://external.link.com']);

  beforeAll(async () => {
    browser = await puppeteer.launch();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('valid.html', async done => {
    const result = await checker(async () => {
      page = await browser.newPage();
      const html = await fs.readFile(
        __dirname + '/check-external-links-fixtures/valid.html',
        'utf-8'
      );
      await page.setContent(html);

      return page;
    });
    expect(result).toBe(true);
    done();
  });

  test('invalid.html', async done => {
    const result = await checker(async () => {
      page = await browser.newPage();
      const html = await fs.readFile(
        __dirname + '/check-external-links-fixtures/invalid.html',
        'utf-8'
      );
      await page.setContent(html);

      return page;
    });
    expect(result).toBe(false);
    done();
  });
});
