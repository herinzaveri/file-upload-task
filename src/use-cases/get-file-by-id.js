module.exports = function makeGetFileById({Joi, ValidationError, filesDb}) {
  return async function getFileById({id, userId}) {
    validateInput({id, userId});

    return await filesDb.getFileByIdAndUserId({id, userId});
  };

  function validateInput({id, userId}) {
    const schema = Joi.object({
      id: Joi.string().required(),
      userId: Joi.string().required(),
    });

    const {error} = schema.validate({id, userId});
    if (error) {
      throw new ValidationError(error.message);
    }
  }
};
