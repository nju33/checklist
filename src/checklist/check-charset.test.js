const fs = require('fs-extra');
const puppeteer = require('puppeteer');
const checkCharset = require('./check-charset');

describe('check-charset', () => {
  let browser;
  let checker = checkCharset('utf-8');

  beforeAll(async () => {
    browser = await puppeteer.launch();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('valid.html', async done => {
    const result = await checker(async () => {
      page = await browser.newPage();
      const html = await fs.readFile(__dirname + '/check-charset-fixtures/valid.html', 'utf-8');
      await page.setContent(html);
      
      return page;
    });
    expect(result).toBe(true);
    done();
  });

  test('invalid.html', async done => {
    const result = await checker(async () => {
      page = await browser.newPage();
      const html = await fs.readFile(__dirname + '/check-charset-fixtures/invalid.html', 'utf-8');
      await page.setContent(html);
      
      return page; 
    });
    expect(result).toBe(false);
    done();
  });
});