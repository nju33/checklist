module.exports = reporter => title => async initPage => {
  const page = await initPage();
  const val = await page.$eval('title', el => el.innerText);

  const result = title === val;
  if (!result) {
    reporter.add(
      'title',
      `「${title}」を期待しましたが、「${val}」でした`
    );

    throw new Error();
  }

  return result;
}