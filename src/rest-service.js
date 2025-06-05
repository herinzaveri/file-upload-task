// Import all Dependencies
const express = require('express');

const controllers = require('./controllers');
const middlewares = require('./middlewares');

const router = express.Router();

// Auth routes
router.post('/auth/login', controllers.loginAction);

// File routes
router.post('/upload', [middlewares.verifyUser, middlewares.singleUpload], controllers.uploadFileAction);
router.get('/files/:fileId', [middlewares.verifyUser], controllers.getFileByIdAction);

module.exports = router;
