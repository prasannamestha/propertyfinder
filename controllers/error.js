exports.catch404 = (req, res, next) => {
  const err = {
    message: 'Invalid API Endpoint',
    status: 404,
  };
  next(err);
};

exports.handle = (err, req, res, next) => {
  res.status(err.status || 500).json({error: err.message || err});
};
