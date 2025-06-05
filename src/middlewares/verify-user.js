module.exports = function makeVerifyUser({jwt, config}) {
  return async function verifyUser(req, res, next) {
    try {
      const token = req.headers['authorization'].split(' ')[1];
      const user = jwt.verify(token, config.jwt.secretKey);

      if (user && user.id) {
        req.user = user;

        next();
      } else {
        return res.formatResponse({
          contentType: 'application/json',
          statusCode: 401,
          body: {error: 'You are not authorized'},
        });
      }
    } catch (e) {
      return res.formatResponse({
        contentType: 'application/json',
        statusCode: 401,
        body: {error: 'You are not authorized'},
      });
    }
  };
};
