import { drizzle } from 'drizzle-orm/libsql';

const { DATABASE_URL, DATABASE_AUTH_TOKEN } = process.env;

const db_prod = ()=>
  drizzle({ connection: {
    url: DATABASE_URL, 
    authToken: DATABASE_AUTH_TOKEN 
  }});


export const db = db_prod();