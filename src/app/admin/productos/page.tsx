'use server'
import Head from 'next/head';
import { db } from "@root/db/config";
import { Category, Product } from "@root/db/schema";
import { Metadata } from 'next';
import { ProductsTable } from './tables';
import { eq } from 'drizzle-orm';

export async function metadata (): Promise<Metadata> {
  return {
    title: 'Productos',
  };
}

export default async function Page() {
    const products = await 
      db.select()
      .from(Product)
      .fullJoin(Category, eq(Product.category_id, Category.id))
      
    const categories = await db.select().from(Category)

    return (
      <>
        <Head>
          <title>Productos</title>
        </Head>
        
        <ProductsTable 
          products={products}
          categories={categories}
        />
    
      </>
    );
}
