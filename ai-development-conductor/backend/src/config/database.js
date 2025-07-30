// Database configuration (ready for future phases)
const config = {
  development: {
    type: 'sqlite',
    database: ':memory:', // In-memory for development
  },
  production: {
    type: 'postgresql',
    url: process.env.DATABASE_URL,
  }
};

module.exports = config[process.env.NODE_ENV || 'development'];
