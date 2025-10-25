import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

const { DATABASE_URL, DATABASE_AUTH_TOKEN } = process.env;

const db_prod = () =>
  drizzle({ 
    connection: {
      url: DATABASE_URL!, 
      authToken: DATABASE_AUTH_TOKEN 
    },
    schema
  });

export const db = db_prod();