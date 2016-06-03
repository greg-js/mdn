const cheerio = require('cheerio');

const parseHTML = (markup, url) => {
  const $ = cheerio.load(markup);
  const title = $('#wiki-document-head h1').text();
  const method = title.split('.').pop();
  const description = $('#wikiArticle > p')
    .filter((index, element) => $(element).text().length !== 0)
    .first()
    .text();

  const usage = $('#Syntax')
    .next('pre')
    .text()
    .trim();

  const api = [];

  $('#wikiArticle').children('dl').children('dt')
    .has('code')
    .each((index, element) => {
      const $element = $(element);
      const term = $element.text();
      const $definition = $element.next('dd');

      if ($definition.has('dl').length === 0) {
        api.push({
          term,
          definition: $definition.text(),
          level: 0
        });
      } else {
        api.push({
          term,
          definition: $definition.text().substr(0, $definition.text().search('\n')),
          level: 0
        });

        $definition.children('dl').children('dt').each((subIndex, subElement) => {
          const $subElement = $(subElement);
          const subTerm = $subElement.text();
          const subDefinition = $subElement
            .next('dd')
            .text();

          api.push({
            term: subTerm,
            definition: subDefinition,
            level: 1
          });
        });
      }
    });

  return {url, title, description, method, usage, api};
};

module.exports = parseHTML;
