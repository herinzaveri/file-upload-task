module.exports = function makeConvertObjectKeysToCamelCase({_, Joi, ValidationError}) {
  return async function convertObjectKeysToCamelCase({data}) {
    validateInput({data});

    if (_.isArray(data)) {
      return data.map((d) => _.mapKeys(d, (value, key) => _.camelCase(key)));
    }

    return _.mapKeys(data, (value, key) => _.camelCase(key));
  };

  function validateInput({data}) {
    const schema = Joi.object({
      data: Joi.array().items(Joi.object()).single().required(),
    });

    const {error} = schema.validate({data});
    if (error) {
      throw new ValidationError(error.message);
    }
  }
};
