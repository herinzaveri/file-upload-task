const fs = require('fs');
const path = require('path');
const {Sequelize} = require('sequelize');

// Load DB config
const config = require('../src/config');
const dbConfig = config.dbConfig;

// Initialize Sequelize
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);

// Path to migrations folder
const migrationsDir = path.resolve(__dirname, '../src/migrations');

async function ensureMigrationsTable() {
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS migrations_executed (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

async function getExecutedMigrations() {
  const [results] = await sequelize.query('SELECT filename FROM migrations_executed');
  return results.map((row) => row.filename);
}

async function markMigrationExecuted(filename) {
  await sequelize.query(
      'INSERT INTO migrations_executed (filename) VALUES (:filename) ON CONFLICT DO NOTHING',
      {replacements: {filename}},
  );
}

async function runMigrations() {
  await ensureMigrationsTable();
  const executed = await getExecutedMigrations();
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.js'));
  for (const file of files) {
    if (executed.includes(file)) {
      console.log(`Skipping already executed migration: ${file}`);
      continue;
    }
    const migration = require(path.join(migrationsDir, file));
    if (typeof migration.up === 'function') {
      console.log(`Running migration: ${file}`);
      await migration.up({sequelize}, Sequelize);
      await markMigrationExecuted(file);
    }
  }
  await sequelize.close();
  console.log('All migrations executed.');
}

runMigrations().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
