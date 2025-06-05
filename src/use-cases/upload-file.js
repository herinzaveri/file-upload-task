module.exports = function makeUploadFile({fs, path, filesDb, fileProcessingQueue, Joi, ValidationError}) {
  return async function uploadFile({file, title, description, userId}) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    validateInput({title, description});

    // Ensure uploads directory exists
    const uploadsDir = path.resolve(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, {recursive: true});
    }

    // Save file to uploads folder
    const filePath = path.join(uploadsDir, file.originalname);
    fs.writeFileSync(filePath, file.buffer);

    const uploadedFile = await filesDb.addFile({
      userId,
      filename: file.originalname,
      path: filePath,
      title,
      description,
      status: 'uploaded',
    });

    // Enqueue background job for processing
    await fileProcessingQueue.add('process', {
      fileId: uploadedFile.id,
      filePath,
      userId,
    });

    // Return file info
    return {
      id: uploadedFile.id,
      filename: file.originalname,
      path: filePath,
      mimetype: file.mimetype,
      size: file.size,
      status: 'uploaded',
    };
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
