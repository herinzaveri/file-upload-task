module.exports = function makeLoginAction({login, Joi, ValidationError}) {
  return async function loginAction(req, res) {
    try {
      const {emailId, password} = req.body;

      validateInput({emailId, password});

      const response = await login({emailId, password});

      res.formatResponse({
        contentType: 'application/json',
        statusCode: 200,
        body: response,
      });
    } catch (error) {
      console.error(`Got error in loginAction controller`, error);
      error.errorCode = 401;
      res.formatError({error});
    }
  };

  function validateInput({emailId, password}) {
    const schema = Joi.object({
      emailId: Joi.string().regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/).required(),
      password: Joi.string().required(),
    });

    const {error} = schema.validate({emailId, password});
    if (error) {
      throw new ValidationError(error.message);
    }
  }
};
