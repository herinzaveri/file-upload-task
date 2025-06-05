/* eslint-disable max-len */
'use strict';

module.exports = {
  up: function(migration, DataTypes) {
    return migration.sequelize.query(
        `CREATE TABLE files (
          id VARCHAR(255) PRIMARY KEY,
          user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
          original_filename VARCHAR(255) NOT NULL,
          storage_path TEXT NOT NULL,
          title VARCHAR(255),
          description TEXT,
          status VARCHAR(50) CHECK (status IN ('uploaded', 'processing', 'processed', 'failed')) NOT NULL DEFAULT 'uploaded',
          extracted_data TEXT,
          uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
`,
    );
  },
  down: function(migration, DataTypes) {
    return migration.dropTable('files');
  },
};
