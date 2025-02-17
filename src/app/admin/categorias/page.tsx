'use server'
import Head from 'next/head';
import { db } from "@root/db/config";
import { Category } from "@root/db/schema";
import { Metadata } from 'next';
import { CustomTable } from './tables';

export async function metadata (): Promise<Metadata> {
  return {
    title: 'Productos',
  };
}

export default async function Page() {
  
    return (
      <>
        <Head>
          <title>Productos</title>
        </Head>

        <CustomTable />
    
      </>
    );
}
