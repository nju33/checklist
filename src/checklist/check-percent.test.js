const fs = require('fs-extra');
const puppeteer = require('puppeteer');
const checkPercent = require('./check-percent');
const initPage = require('../init-page');

jest.setTimeout(60000);

describe('check-percent', () => {
  let browser;
  let add = jest.fn();
  let checker = checkPercent({add})('％');

  beforeAll(async () => {
    browser = await puppeteer.launch();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('valid.html', async done => {
    const result = await checker(initPage(browser)(__dirname + '/check-percent-fixtures/valid.html'))

    expect(result).toBe(true);
    done();
  });

  test('invalid.html', async done => {
    await expect(checker(initPage(browser)(__dirname + '/check-percent-fixtures/invalid.html'))).rejects.toThrow();

    expect(add).toHaveBeenCalled();
    expect(add.mock.calls[0][0]).toBe('percent');
    expect(add.mock.calls[0][1]).toBe('「％」だけを期待しましたが、「%」が含まれていました');

    done();
  });
});
