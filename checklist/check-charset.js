module.exports = reporter => charset => async initPage => {
  const page = await initPage();
  const val = await page.$eval('meta[charset]', el => el.getAttribute('charset'));

  const result = charset.toLowerCase() === val.toLowerCase();

  if (!result) {
    reporter.add(
      'charset',
      `「${charset}」を期待しましたが、「${val}」でした`
    );
    throw new Error();
  }

  return result;
}