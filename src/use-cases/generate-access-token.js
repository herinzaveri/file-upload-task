module.exports = function makeGenerateAccessToken({Joi, ValidationError, jwt, jwtConfig}) {
  return async function generateAccessToken({data}) {
    validateInput({data});

    const accessToken = jwt.sign(data, jwtConfig.secretKey);

    return accessToken;
  };

  function validateInput({data}) {
    const schema = Joi.object({
      data: Joi.object().required(),
    });

    const {error} = schema.validate({data});
    if (error) {
      throw new ValidationError(error.message);
    }
  }
};
