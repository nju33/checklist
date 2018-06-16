const fs = require('fs-extra');
const puppeteer = require('puppeteer');
const checkTitle = require('./check-title');

jest.setTimeout(60000);

describe('check-title', () => {
  let browser;
  let checker = checkTitle('Document');

  beforeAll(async () => {
    browser = await puppeteer.launch();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('valid.html', async done => {
    const result = await checker(async () => {
      page = await browser.newPage();
      const html = await fs.readFile(__dirname + '/check-title-fixtures/valid.html', 'utf-8');
      await page.setContent(html);
      
      return page;
    })();
    expect(result).toBe(true);
    done();
  });

  test('invalid.html', async done => {
    const result = await checker(async () => {
      page = await browser.newPage();
      const html = await fs.readFile(__dirname + '/check-title-fixtures/invalid.html', 'utf-8');
      await page.setContent(html);
      
      return page; 
    })();
    expect(result).toBe(false);
    done();
  });
});