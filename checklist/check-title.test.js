const fs = require('fs-extra');
const puppeteer = require('puppeteer');
const checkTitle = require('./check-title');
const initPage = require('../init-page');

jest.setTimeout(60000);

describe('check-title', () => {
  let browser;
  let add = jest.fn();
  let checker = checkTitle({add})('Document');

  beforeAll(async () => {
    browser = await puppeteer.launch();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('valid.html', async done => {
    const result = await checker(
      initPage(browser)(__dirname + '/check-title-fixtures/valid.html')
    );

    expect(result).toBe(true);
    done();
  });

  test('invalid.html', async done => {
    await expect(
      checker(
        initPage(browser)(__dirname + '/check-title-fixtures/invalid.html')
      )
    ).rejects.toThrow();

    expect(add).toHaveBeenCalled();
    expect(add.mock.calls[0][0]).toBe('title');
    expect(add.mock.calls[0][1]).toBe(
      '「Document」を期待しましたが、「Invalid Document」でした'
    );

    done();
  });
});
