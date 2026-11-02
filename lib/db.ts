import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('Falta la variable DATABASE_URL en el archivo .env');
}

export const sql = neon(process.env.DATABASE_URL);

