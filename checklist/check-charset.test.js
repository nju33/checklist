const fs = require('fs-extra');
const puppeteer = require('puppeteer');
const checkCharset = require('./check-charset');
const initPage = require('../init-page');

jest.setTimeout(60000);

describe('check-charset', () => {
  let browser;
  let add = jest.fn();
  let checker = checkCharset({add})('utf-8');

  beforeAll(async () => {
    browser = await puppeteer.launch();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('valid.html', async done => {
    const result = await checker(
      initPage(browser)(__dirname + '/check-charset-fixtures/valid.html')
    );

    expect(result).toBe(true);
    done();
  });

  test('invalid.html', async done => {
    await expect(checker(initPage(browser)(__dirname + '/check-charset-fixtures/invalid.html')))
      .rejects.toThrow();
    expect(add).toHaveBeenCalled();
    expect(add.mock.calls[0][0]).toBe('charset');
    expect(add.mock.calls[0][1]).toBe('「utf-8」を期待しましたが、「shift-jis」でした');

    done();
  });
});
