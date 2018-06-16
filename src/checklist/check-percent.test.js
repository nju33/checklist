const fs = require('fs-extra');
const puppeteer = require('puppeteer');
const checkPercent = require('./check-percent');

jest.setTimeout(60000);

describe('check-percent', () => {
  let browser;
  let checker = checkPercent('％');

  beforeAll(async () => {
    browser = await puppeteer.launch();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('valid.html', async done => {
    const result = await checker(async () => {
      page = await browser.newPage();
      const html = await fs.readFile(__dirname + '/check-percent-fixtures/valid.html', 'utf-8');
      await page.setContent(html);
      
      return page;
    })();
    expect(result).toBe(true);
    done();
  });

  test('invalid.html', async done => {
    const result = await checker(async () => {
      page = await browser.newPage();
      const html = await fs.readFile(__dirname + '/check-percent-fixtures/invalid.html', 'utf-8');
      await page.setContent(html);
      
      return page; 
    })();
    expect(result).toBe(false);
    done();
  });
});
