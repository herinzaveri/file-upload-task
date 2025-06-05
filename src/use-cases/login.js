module.exports = function makeLogin({generateAccessToken, Joi, ValidationError, usersDb}) {
  return async function Login({emailId, password}) {
    validateInput({emailId, password});

    const user = await usersDb.getUserByEmailId({emailId});

    if (!user) {
      throw new Error('User does not exist');
    }

    if (password === user.password) {
      const accessToken = await generateAccessToken({data: user});

      return {accessToken, loginSuccess: true};
    }

    return {loginSuccess: false};
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
