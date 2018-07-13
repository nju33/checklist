module.exports = reporter => externalLinks => async initPage => {
  const page = await initPage();

  const externalLinkElementHandles = await Promise.all(
    externalLinks.map(externalLink => {
      return page.$$(`a[href="${externalLink}"]`);
    })
  ).then(elements => {
    const existElement = el => el;

    return elements
      .reduce((acc, elements) => {
        return [...acc, ...elements];
      }, [])
      .filter(existElement);
  });

  const validate = element => {
    const hrefAttr = element.getAttribute('href');
    const targetAttr = element.getAttribute('target');
    const relAttr = element.getAttribute('rel');
    const invalid = [];

    if (targetAttr !== '_blank') {
      invalid.push('[target=_blank]');
    }

    if (!/noopener/.test(relAttr)) {
      invalid.push('[rel*=noopener]');
    }

    if (!/noreferrer/.test(relAttr)) {
      if (invalid.length === 2) {
        invalid[1] = '[rel="noopener noreferrer"]';
      } else {
        invalid.push('[rel*=noreferrer]');
      }
    }

    return {href: hrefAttr, invalid};
  };

  const results = await Promise.all(
    externalLinkElementHandles.map(externalLinkElementHandle => {
      return page.evaluate(validate, externalLinkElementHandle);
    })
  );

  const result = results.every(v => !v.invalid.length);

  if (!result) {
    results
      .filter(({invalid}) => invalid.length)
      .forEach(({href, invalid}) => {
        reporter.add(
          'external-links',
          `a[href=${href}]に${invalid.join(' ')}属性がありません`
        );
      });

    throw new Error();
  }

  return result;
};
