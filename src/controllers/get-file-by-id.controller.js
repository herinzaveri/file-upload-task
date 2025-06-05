module.exports = function makeGetFileByIdAction({getFileById, convertObjectKeysToCamelCase, Joi, ValidationError}) {
  return async function getUserByIdAction(req, res) {
    try {
      const id = req.params.fileId;
      const userId = req.user.id;

      validateInput({id, userId});

      const response = await getFileById({id, userId});
      const camelResponse = await convertObjectKeysToCamelCase({data: response || {}});

      res.formatResponse({
        contentType: 'application/json',
        statusCode: 200,
        body: camelResponse,
      });
    } catch (error) {
      console.error(`Got error in getFileByIdAction controller`, error);
      res.formatError({error});
    }
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
