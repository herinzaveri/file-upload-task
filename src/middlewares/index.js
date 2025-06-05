// Import all Dependencies
const jwt = require('jsonwebtoken');
const multer = require('multer');

const config = require('../config');

// Import all middlewares
const makeFormatting = require('./formatting');
const makeVerifyUser = require('./verify-user');

// Make all middlewares
const formatting = makeFormatting();
const verifyUser = makeVerifyUser({jwt, config});

const singleUpload = multer().single('file');

// Export all middlewares
module.exports = {
  formatting,
  verifyUser,
  singleUpload,
};
