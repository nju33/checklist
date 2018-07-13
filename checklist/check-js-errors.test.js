const fs = require('fs-extra');
const puppeteer = require('puppeteer');
const checkJSErrors = require('./check-js-errors');
const initPage = require('../init-page');
const delay = require('delay');

jest.setTimeout(60000);

describe('check-js-errors', () => {
  let browser;
  let add = jest.fn();
  let checker = checkJSErrors({add});

  beforeAll(async () => {
    browser = await puppeteer.launch();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('valid.html', async done => {
    const result = await checker(
      initPage(browser)(__dirname + '/check-js-errors-fixtures/valid.html')
    );

    expect(result).toBe(true);
    done();
  });

  test('invalid.html', async done => {
    const result = await checker(
      initPage(browser)(__dirname + '/check-js-errors-fixtures/invalid.html')
    );

    expect(result).toBe(false);
    expect(add).toHaveBeenCalled();
    expect(add.mock.calls[0][1]).toBe('Error: TypeError: Assignment to constant variable.');

    done();
  });
});
