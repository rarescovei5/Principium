// Load Environment Data
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env') });

// Create a connection to the database
import mysql from 'mysql2/promise';

const mysqlConnection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

//
import express from 'express';

const snippetRouter = express.Router();
snippetRouter.get('');
const app = express();

app.listen(4400, () => {
  console.log('[server]: Listening on port ${PORT}');
});
