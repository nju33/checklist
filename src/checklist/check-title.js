module.exports = title => initPage => async () => {
  const page = await initPage();
  const val = await page.$eval('title', el => el.innerText);

  if (process.env.NODE_ENV === 'test') {
    return title === val;
  }

  if (title !== val) {
    throw new Error(`Expected "${title}", but "${val}"`);
  }
}