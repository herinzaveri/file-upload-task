/* eslint-disable max-len */
'use strict';

module.exports = {
  up: function(migration, DataTypes) {
    return migration.sequelize.query(
        `CREATE TABLE jobs (
          id VARCHAR(255) PRIMARY KEY,
          file_id VARCHAR(255) REFERENCES files(id) ON DELETE CASCADE,
          job_type VARCHAR(50),
          status VARCHAR(50) CHECK (status IN ('queued', 'processing', 'completed', 'failed')) NOT NULL,
          error_message TEXT,
          started_at TIMESTAMP,
          completed_at TIMESTAMP
        );
`,
    );
  },
  down: function(migration, DataTypes) {
    return migration.dropTable('jobs');
  },
};
