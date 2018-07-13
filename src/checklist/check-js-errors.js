const delay = require('delay');

module.exports = reporter => async initPage => {
  const pageerror = [];
  const page = await initPage({
    handlePageError(err) {
      pageerror.push(err);
    }
  });

  await delay(3000);

  pageerror.forEach(err => {
    reporter.add('javascript', err.toString().split('\n')[0]);
  });

  return !pageerror.length;
};
