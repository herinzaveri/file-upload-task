// Import all Dependencies
const Joi = require('joi');
const {ValidationError} = require('joi');

// Import all use cases
const useCases = require('../use-cases');

// Import all actions
const makeLoginAction = require('./login.controller');
const makeUploadFileAction = require('./upload-file.controller');
const makeGetFileByIdAction = require('./get-file-by-id.controller');

// Make all actions
const loginAction = makeLoginAction({
  login: useCases.login,
  Joi,
  ValidationError,
});
const uploadFileAction = makeUploadFileAction({
  uploadFile: useCases.uploadFile,
  Joi,
  ValidationError,
});
const getFileByIdAction = makeGetFileByIdAction({
  getFileById: useCases.getFileById,
  convertObjectKeysToCamelCase: useCases.convertObjectKeysToCamelCase,
  Joi,
  ValidationError,
});

// Export all actions
module.exports = {
  loginAction,
  uploadFileAction,
  getFileByIdAction,
};
