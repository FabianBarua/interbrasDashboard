'use server'
import Head from 'next/head';
import { db } from "@root/db/config";
import { Category, Color, Photo, Product, Variant, Volt } from "@root/db/schema";
import { Metadata } from 'next';
import { CustomTable } from './tables';
import { eq, min } from 'drizzle-orm';

export async function metadata (): Promise<Metadata> {
  return {
    title: 'Productos',
  };
}

export default async function Page() {
    const variants = await 
      db.select()
      .from(Variant)
      .fullJoin(Product, eq(Variant.product_id, Product.id))
      .fullJoin(Color, eq(Variant.color_id, Color.id))
      .fullJoin(Volt, eq(Variant.volt_id, Volt.id))
      .fullJoin(Photo, eq(Variant.id, Photo.variant_id))
      .where(
        eq(
          Photo.order,
          db
            .select({ order: min(Photo.order) })
            .from(Photo)
            .where(eq(Photo.variant_id, Variant.id))
        )
      )

      
    const categories = await db.select().from(Category)

    return (
      <>
        <Head>
          <title>Productos</title>
        </Head>
        
        <CustomTable 
          variants={variants}
          categories={categories}
        />
    
      </>
    );
}
