module.exports = function makeUploadFileAction({uploadFile, Joi, ValidationError}) {
  return async function uploadFileAction(req, res) {
    try {
      const file = req.file;
      const {title, description} = req.body;

      validateInput({title, description});

      const response = await uploadFile({file, title, description, userId: req.user.id});

      res.formatResponse({
        contentType: 'application/json',
        statusCode: 200,
        body: response,
      });
    } catch (error) {
      console.error(`Got error in uploadFileAction controller`, error);
      res.formatError({error});
    }
  };

  function validateInput({title, description}) {
    const schema = Joi.object({
      title: Joi.string().allow(null, ''),
      description: Joi.string().allow(null, ''),
    });

    const {error} = schema.validate({title, description});
    if (error) {
      throw new ValidationError('Invalid metadata');
    }
  }
};
