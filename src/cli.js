const fs = require('fs-extra');
const yargs = require('yargs');
const isUrl = require('is-url');
const puppeteer = require('puppeteer');
const checkCharset = require('./checklist/check-charset');
const commaSymbols = require('./symbols/comma');
const ellipsisSymbols = require('./symbols/ellipsis');
const percentSymbols = require('./symbols/percent');
const quoteSymbols = require('./symbols/quote');
// const got = require('got');
// const cheerio = require('cheerio');

yargs
  .command('$0 [filename]', 'test', yargs => {
    yargs.positional('filename', {
      type: 'string',
      describe: 'target filename'
    })
    .option('charset', {
      type: 'string',
      default: 'utf-8',
    })
    .option('comma', {
      choices: commaSymbols,
      default: commaSymbols[0]
    })
    .option('ellipsis', {
      choices: ellipsisSymbols,
      default: ellipsisSymbols[0]
    })
    .option('quote', {
      choices: quoteSymbols,
      default: quoteSymbols[0]
    })
    .option('percent', {
      choices: percentSymbols,
      default: percentSymbols[0]
    })
  },
  async argv => {
    // if (!isUrl(argv.url)) {
    //   yargs.showHelp();
    //   throw new Error('URLを指定してください');
    // }
    const {filename} = argv;

    const browser = await puppeteer.launch();
    const initPage = async () => {
      page = await browser.newPage();
      const html = await fs.readFile(filename, 'utf-8');
      await page.setContent(html);
      
      return page;
    };
    // await page.goto('url', {
    //   waitUntil: 'networkidle2'
    // });

    const result = await Promise.all([
      checkCharset(argv.charset)(initPage),
      checkCommma(argv.comma)(initPage),
    ])

    console.log(result);

    await browser.close();
  })
  .help()
  .argv;