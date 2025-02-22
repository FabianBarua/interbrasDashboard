import { drizzle } from 'drizzle-orm/libsql';
export * from './schemaAuth';

const { DATABASE_URL, DATABASE_AUTH_TOKEN } = process.env;

const db_prod = ()=>
  drizzle({ connection: {
    url: DATABASE_URL || 'not set', 
    authToken: DATABASE_AUTH_TOKEN || 'not set'
  }});


export const db = db_prod();