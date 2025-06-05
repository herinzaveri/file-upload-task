// Import all Dependencies
const {Pool} = require('pg');
const crypto = require('crypto');
const moment = require('moment');

const config = require('../config');

const pg = new Pool({
  host: config.dbConfig.host,
  port: config.dbConfig.port,
  user: config.dbConfig.username,
  password: config.dbConfig.password,
  database: config.dbConfig.database,
  max: config.dbConfig.poolSize,
  ssl: config.dbConfig.ssl,
});

async function generateId({tableName = '', length = 8}) {
  let uniqueId = '';
  let idGenerationPending = true;

  while (idGenerationPending) {
    uniqueId = crypto.randomBytes(length).toString('base64url');

    const query = `SELECT id FROM ${tableName} WHERE id=$1`;
    const values = [uniqueId];

    const result = await pg.query(query, values);

    if (result.rows.length === 0) {
      idGenerationPending = false;
    }
  }

  return uniqueId;
}

// Import and make all DBs
const makeUsersDb = require('./users.db');
const usersDb = makeUsersDb({pg, generateId, moment});

const makeFilesDb = require('./files.db');
const filesDb = makeFilesDb({pg, generateId, moment});

// Export all DBs
module.exports = Object.freeze({
  usersDb,
  filesDb,
});
