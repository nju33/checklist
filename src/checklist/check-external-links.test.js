const fs = require('fs-extra');
const puppeteer = require('puppeteer');
const checkExternalLinks = require('./check-external-links');
const initPage = require('../init-page');

jest.setTimeout(60000);

describe('check-links', () => {
  let browser;
  let add = jest.fn();
  let checker = checkExternalLinks({add})(['https://external.link.com']);

  beforeAll(async () => {
    browser = await puppeteer.launch();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('valid.html', async done => {
    const result = await checker(
      initPage(browser)(__dirname + '/check-external-links-fixtures/valid.html')
    );

    expect(result).toBe(true);
    done();
  });

  test('invalid.html', async done => {
    await expect(
      checker(
        initPage(browser)(
          __dirname + '/check-external-links-fixtures/invalid.html'
        )
      )
    ).rejects.toThrow();

    expect(add).toHaveBeenCalled();
    expect(add.mock.calls[0][0]).toBe('external-links');
    expect(add.mock.calls[0][1]).toBe(
      'a[href=https://external.link.com]に[target=_blank] [rel="noopener noreferrer"]属性がありません'
    );

    done();
  });
});
