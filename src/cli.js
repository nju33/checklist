#!/usr/bin/env node
const path = require('path');
const fs = require('fs-extra');
const yargs = require('yargs');
const Listr = require('listr');
const isUrl = require('is-url');
const puppeteer = require('puppeteer');
const commaSymbols = require('./symbols/comma');
const ellipsisSymbols = require('./symbols/ellipsis');
const percentSymbols = require('./symbols/percent');
const quoteSymbols = require('./symbols/quote');
const slashSymbols = require('./symbols/slash');
const validateFilenameOrUrl = require('./validations/filename-or-url');
const validateExternalLinks = require('./validations/external-links');
const Reporter = require('./reporter');
const initPage = require('./init-page');
let checkCharset = require('./checklist/check-charset');
let checkTitle = require('./checklist/check-title');
let checkComma = require('./checklist/check-comma');
let checkEllipsis = require('./checklist/check-ellipsis');
let checkQuote = require('./checklist/check-quote');
let checkPercent = require('./checklist/check-percent');
let checkExternalLinks = require('./checklist/check-external-links');
let checkJSErrors = require('./checklist/check-js-errors');

yargs
  .command(
    '$0 [filename-or-url]',
    'test',
    yargs => {
      yargs
        .positional('filename-or-url', {
          type: 'string',
          describe: 'Specify target filename or URL'
        })
        .option('charset', {
          alias: 'c',
          type: 'string',
          default: 'utf-8',
          demandOption: true
        })
        .option('title', {
          alias: 't',
          type: 'string',
          demandOption: true
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
        .option('slash', {
          choices: slashSymbols,
          default: slashSymbols[0]
        })
        .option('external-links', {
          type: 'array',
          default: []
        });
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

      const reporter = new Reporter();
      checkCharset = checkCharset(reporter);
      checkTitle = checkTitle(reporter);
      checkComma = checkComma(reporter);
      checkEllipsis = checkEllipsis(reporter);
      checkQuote = checkQuote(reporter);
      checkPercent = checkPercent(reporter);
      checkExternalLinks = checkExternalLinks(reporter);
      checkJSErrors = checkJSErrors(reporter);

      const browser = await puppeteer.launch();
      const initPageWithBrowser = initPage(browser);

      const tasks = new Listr(
        [
          {
            title: 'Meta',
            task: () => {
              return new Listr(
                [
                  {
                    title: `<meta charset=${argv.charset}>`,
                    task: () => checkCharset(argv.charset)(initPageWithBrowser(filenameOrUrl)),
                  },
                  {
                    title: `<title>${argv.title}</title>`,
                    task: () => checkTitle(argv.title)(initPageWithBrowser(filenameOrUrl)),
                  }
                ],
                {
                  exitOnError: false
                }
              );
            }
          },
          {
            title: 'Symbol',
            task: () => {
              return new Listr(
                [
                  {
                    title: 'comma',
                    task: () => checkComma(argv.comma)(initPageWithBrowser(filenameOrUrl))
                  },
                  {
                    title: 'ellipsis',
                    task: () => checkEllipsis(argv.ellipsis)(initPageWithBrowser(filenameOrUrl))
                  },
                  {
                    title: 'quote',
                    task: () => checkQuote(argv.quote)(initPageWithBrowser(filenameOrUrl))
                  },
                  {
                    title: 'percent',
                    task: () => checkPercent(argv.percent)(initPageWithBrowser(filenameOrUrl))
                  }
                ],
                {
                  exitOnError: false
                }
              );
            }
          },
          {
            title: 'Attribute',
            task: () => {
              return new Listr(
                [
                  {
                    title: 'external links',
                    task: () => checkExternalLinks(argv.externalLinks)(initPageWithBrowser(filenameOrUrl))
                  }
                ],
                {
                  exitOnError: false
                }
              );
            }
          },
          {
            title: 'JavaScript',
            task: () => {
              return new Listr([
                {
                  title: 'js error',
                  task: () => checkJSErrors(initPageWithBrowser(filenameOrUrl))
                }
              ]);
            }
          }
        ],
        {
          exitOnError: false
        }
      );

      await tasks.run().catch(err => undefined);
      await browser.close();

      if (reporter.hasMessage()) {
        reporter.message();
        process.exit(1);
      }
    }
  )
  .help().argv;
