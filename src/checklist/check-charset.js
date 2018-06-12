module.exports = charset => async initPage => {
  const page = await initPage();
  const val = await page.$eval('meta[charset]', el => el.getAttribute('charset'));

  return charset.toLowerCase() === val.toLowerCase();
}