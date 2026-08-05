const { Pool } = require("pg");

const pool = new Pool(
  process.env.NODE_ENV === "production"
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      }
    : {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      }
);

pool.connect()
  .then(() => console.log("Conectado a PostgreSQL"))
  .catch((err) => console.error("Error conectando a PostgreSQL:", err));

module.exports = pool;