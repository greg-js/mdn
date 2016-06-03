'use strict';

const got = require('got');
const open = require('open');
const parseHTML = require('./parse');
const formatConsole = require('./format');

const SEARCH_URL = {
  js: 'JavaScript/Reference/Global_Objects',
  css: 'CSS'
};

const getBaseUrl = locale => `https://developer.mozilla.org/${locale}/docs/Web`;

const fetch = (keyword, language, shouldOpen, locale, toConsole) => {
  const baseUrl = getBaseUrl(locale);
  const parts = keyword.replace(/prototype\./, '').split('.');
  const url = `${baseUrl}/${SEARCH_URL[language]}/${parts[0]}/${parts[1] || ''}`;
  const options = {
    headers: {
      'user-agent': 'https://github.com/rafaelrinaldi/mdn'
    }
  };

  if (shouldOpen) {
    return new Promise(resolve => {
      resolve(open(url));
    });
  }

  return got(url, options)
    .then(response => {
      const contentObject = parseHTML(response.body, url);
      if (toConsole) {
        return new Promise(resolve => resolve(formatConsole(contentObject)));
      } else {
        return new Promise(resolve => resolve(contentObject));
      }
    })
    .catch(error => {
      if (error.statusCode === 404) {
        console.error(`"${keyword}" not found for language "${language}"`);
      } else {
        console.error(error.stack);
      }

      process.exit(1);
    });
};

module.exports = options => {
  const keyword = options.keyword || options;
  const language = options.language || 'js';
  const shouldOpen = options.shouldOpen || false;
  const locale = options.locale || 'en-US';
  const toConsole = options.toConsole;

  return fetch(
    keyword,
    language,
    shouldOpen,
    locale,
    toConsole
  );
};
