const fs = require('fs-extra');
const puppeteer = require('puppeteer');
const checkQuote = require('./check-quote');

jest.setTimeout(60000);

describe('check-quote', () => {
  let browser;
  let checker = checkQuote('”');

  beforeAll(async () => {
    browser = await puppeteer.launch();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('valid.html', async done => {
    const result = await checker(async () => {
      page = await browser.newPage();
      const html = await fs.readFile(__dirname + '/check-quote-fixtures/valid.html', 'utf-8');
      await page.setContent(html);
      
      return page;
    })();
    expect(result).toBe(true);
    done();
  });

  test('invalid.html', async done => {
    const result = await checker(async () => {
      page = await browser.newPage();
      const html = await fs.readFile(__dirname + '/check-quote-fixtures/invalid.html', 'utf-8');
      await page.setContent(html);
      
      return page; 
    })();
    expect(result).toBe(false);
    done();
  });
});
