'use strict';

module.exports = {
  up: function(migration, DataTypes) {
    return migration.sequelize.query(
        `CREATE TABLE users (
          id VARCHAR(255) PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        INSERT INTO users (id, email, password) VALUES ('user-1', 'admin@example.com', 'password123');`,
    );
  },
  down: function(migration, DataTypes) {
    return migration.dropTable('users');
  },
};
