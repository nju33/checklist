const path = require('path');
const fs = require('fs-extra');
const yargs = require('yargs');
const isUrl = require('is-url');
const puppeteer = require('puppeteer');
const commaSymbols = require('./symbols/comma');
const ellipsisSymbols = require('./symbols/ellipsis');
const percentSymbols = require('./symbols/percent');
const quoteSymbols = require('./symbols/quote');
const validateFilenameOrUrl = require('./validations/filename-or-url');
const validateExternalLinks = require('./validations/external-links');
const checkCharset = require('./checklist/check-charset');
const checkComma = require('./checklist/check-charset');
const checkEllipsis = require('./checklist/check-charset');
const checkQuote = require('./checklist/check-charset');
const checkPercent = require('./checklist/check-charset');
const checkExternalLinks = require('./checklist/check-external-links');
const Reporter = require('./reporter');
// const got = require('got');
// const cheerio = require('cheerio');

yargs
  .command('$0 [filename-or-url]', 'test', yargs => {
    yargs.positional('filename-or-url', {
      type: 'string',
      describe: 'Specify target filename or URL'
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
    .option('external-links', {
      type: 'array',
      default: [],
    })
  },
  async argv => {
    const {filenameOrUrl} = argv;
    try {
      await validateFilenameOrUrl(filenameOrUrl);
      await validateExternalLinks(argv.externalLinks);
    } catch (err) {
      console.error(err);
      yargs.showHelp();
      process.exit(1);
    }

    const browser = await puppeteer.launch();
    const initPage = async () => {
      page = await browser.newPage();
      if (isUrl(filenameOrUrl)) {
        const url = filenameOrUrl;
        await page.goto(url);
      } else {
        const relativePath = filenameOrUrl;
        const filename = path.resolve(process.cwd(), relativePath);
        const html = await fs.readFile(filename, 'utf-8');
        await page.setContent(html);
      }
      
      return page;
    };

    const result = await Promise.all([
      Reporter.report(checkCharset(argv.charset)(initPage)),
      checkComma(argv.comma)(initPage),
      checkEllipsis(argv.ellipsis)(initPage),
      checkQuote(argv.quote)(initPage),
      checkPercent(argv.percent)(initPage),
      checkExternalLinks(argv.externalLinks)(initPage),
    ])

    console.log(result);

    await browser.close();
  })
  .help()
  .argv;