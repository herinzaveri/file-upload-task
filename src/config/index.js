
const config = {
  dbConfig: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    database: process.env.DB_NAME || 'filedb',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'root',
    poolSize: 10,
    dialect: 'postgres',
  },
  jwt: {
    secretKey: process.env.JWT_SECRET || 'c434213e0eed8b44085',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  servicePort: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
};

module.exports = config;
