'use strict';

const table = require('columnify');
const chalk = require('chalk');
const wrap = require('wordwrap')(90);

const formatConsole = contentObject => {
  let description = contentObject.description;
  let usage = contentObject.usage;
  const api = contentObject.api;
  const url = contentObject.url;
  const title = contentObject.title;
  const method = contentObject.method;

  const methodWithoutParens = method.replace(/\(\)/, '');

  const consoleApi = [];

  description = description
    .replace(title, chalk.bold(title))
    .replace(method, chalk.bold(method));

  usage = usage
    .split(/\n/)
    .map((line, index) => {
      return `\t${index} | ${line}\n`;
    })
    .join('')
    .replace(new RegExp(methodWithoutParens, 'gim'), chalk.underline(methodWithoutParens));

  console.log(`\n${chalk.bold(title)}`);
  console.log(`\n${wrap(description)}\n`);

  if (/[a-z]/.test(usage)) {
    console.log(`${usage}\n`);
  }

  api.forEach((apiObject, index) => {
    const term = apiObject.term;
    const def = apiObject.definition;
    const level = apiObject.level;

    if (level === 0) {
      if (index !== 0) {
        // causes empty line to be output for cosmetic purposes
        consoleApi.push({
          term: '',
          definition: ''
        });
      }
      consoleApi.push({
        term: chalk.bold(term),
        definition: def.replace(new RegExp(term, 'gim'), chalk.bold(term))
      });
    } else {
      consoleApi.push({
        term: `..${chalk.underline(term)}`,
        definition: `..${def.replace(new RegExp(term, 'gim'), chalk.underline(term))}`
      });
    }
  });

  console.log(table(consoleApi, {
    showHeaders: false,
    config: {
      term: {
        minWidth: 15
      },
      definition: {
        maxWidth: 65
      }
    }
  }));

  console.log(`\n${chalk.dim(url)}`);
};

module.exports = formatConsole;
