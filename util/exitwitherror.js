const exitWithError = (error) => {
  if (typeof error === 'string') {
    console.log(error);
  } else {
    console.log('Some error occured', error);
  }
  process.exit(1);
};

module.exports = exitWithError;
