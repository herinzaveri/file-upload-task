// Import all Dependencies
const Joi = require('joi');
const {ValidationError} = require('joi');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const config = require('../config');
const fileProcessingQueue = require('../queues/fileProcessingQueue');

// Import all DBs
const dbs = require('../data-access');

// Import all use cases
const makeConvertObjectKeysToCamelCase = require('./convert-object-keys-to-camel-case');
const makeGenerateAccessToken = require('./generate-access-token');
const makeLogin = require('./login');
const makeUploadFile = require('./upload-file');
const makeGetFileById = require('./get-file-by-id');

// Make all use cases
const convertObjectKeysToCamelCase = makeConvertObjectKeysToCamelCase({_, Joi, ValidationError});
const generateAccessToken = makeGenerateAccessToken({Joi, ValidationError, jwt, jwtConfig: config.jwt});
const login = makeLogin({
  generateAccessToken,
  Joi,
  ValidationError,
  usersDb: dbs.usersDb,
});
const uploadFile = makeUploadFile({
  fs,
  path,
  filesDb: dbs.filesDb,
  fileProcessingQueue: fileProcessingQueue,
  Joi,
  ValidationError,
});
const getFileById = makeGetFileById({
  Joi,
  ValidationError,
  filesDb: dbs.filesDb,
});

// Export all use cases
module.exports = {
  convertObjectKeysToCamelCase,
  generateAccessToken,
  login,
  uploadFile,
  getFileById,
};
