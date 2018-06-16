module.exports = externalLinks => initPage => async () => {
  const page = await initPage();

  const externalLinkElementHandles = await Promise.all(
    externalLinks.map(externalLink => {
      return page.$(`a[href="${externalLink}"]`);
    })
  ).then(elements => {
    const existElement = el => el;
    return elements.filter(existElement);
  });

  const validate = element => {
    const targetAttr = element.getAttribute('target');
    const relAttr = element.getAttribute('rel') ;

    if (targetAttr !== '_blank') {
      return false;
    }

    if (!/noopener/.test(relAttr)) {
      return false;
    }

    if (!/noreferrer/.test(relAttr)) {
      return false;
    }

    return true;
  }
  const result = await Promise.all(
    externalLinkElementHandles.map(externalLinkElementHandle => {
      return page.evaluate(validate, externalLinkElementHandle)
    })
  )

  return result.every(v => v);
};
