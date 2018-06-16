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
const checkCharset = require('./checklist/check-charset');
const checkTitle = require('./checklist/check-title');
const checkComma = require('./checklist/check-comma');
const checkEllipsis = require('./checklist/check-ellipsis');
const checkQuote = require('./checklist/check-quote');
const checkPercent = require('./checklist/check-percent');
const checkExternalLinks = require('./checklist/check-external-links');
const Reporter = require('./reporter');
// const got = require('got');
// const cheerio = require('cheerio');

const reporter = new Reporter();

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

      const tasks = new Listr([
        {
          title: 'meta',
          task: () => {
            return new Listr([
              {
                exitOnError: false,
                title: `<meta charset=${argv.charset}>`,
                task: checkCharset(argv.charset)(initPage)
              },
              {
                exitOnError: false,
                title: `<meta charset=${argv.charset}>`,
                title: `<title>${argv.title}</title>`,
                task: checkTitle(argv.title)(initPage)
              }
            ], {
              exitOnError: false
            })
          }
        },
        {
          title: 'symbol',
          task: () => {
            return new Listr([
              {
                title: 'comma',
                task: checkComma(argv.comma)(initPage)
              },
              {
                title: 'ellipsis',
                task: checkEllipsis(argv.ellipsis)(initPage)
              },
              {
                title: 'quote',
                task: checkQuote(argv.quote)(initPage)
              },
              {
                title: 'percent',
                task: checkPercent(argv.percent)(initPage)
              },
            ], {
              exitOnError: false
            })
          }
        },
        {
          title: 'attribute',
          task: () => {
            return new Listr([
              {
                title: 'external links',
                task: checkExternalLinks(argv.externalLinks)(initPage)
              }
            ], {
              exitOnError: false
            })
          }
        }
      ], {
        exitOnError: false
      })

      await tasks.run().catch(err => undefined)
      await browser.close();
    }
  )
  .help().argv;
