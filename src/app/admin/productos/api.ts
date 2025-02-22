"use server";

import { LANGUAGES } from "@/lib/constants";
import { select } from "@heroui/theme";
import { db } from "@root/db/config";
import { Category, CategoryTranslation, Product, ProductTranslation, Variant } from "@root/db/schema";
import { and, eq, inArray, sql } from "drizzle-orm";

interface translation {
    name: string;
    review: string;
    included: null | string;
    specs: string;
    lang: string;
}

export interface ProductsData {
    id: string;
    esTranslation: translation;
    ptTranslation: translation;
    category: {
        id: string;
        name: string;
    }
    variants: number;
}

export interface ProductsToUpdate {
    id: string;
    name_es: string;
    name_pt: string;
}

export const getData = async (params?: {id?:string}) : Promise<ProductsData[]> => {

    const filters = []

    if (params?.id) {
        filters.push(eq(Product.id, params.id))
    }

    const result = await db.select({
        id: sql<string>`COALESCE(${Product.id}, '')`,
        esTranslation:{
            name: sql<string>`MAX(CASE WHEN ${ProductTranslation.lang} = ${LANGUAGES.ES} THEN ${ProductTranslation.name} END)`,
            review: sql<string>`MAX(CASE WHEN ${ProductTranslation.lang} = ${LANGUAGES.ES} THEN ${ProductTranslation.review} END)`,
            included: sql<string>`MAX(CASE WHEN ${ProductTranslation.lang} = ${LANGUAGES.ES} THEN ${ProductTranslation.included} END)`,
            specs: sql<string>`MAX(CASE WHEN ${ProductTranslation.lang} = ${LANGUAGES.ES} THEN ${ProductTranslation.specs} END)`,
            lang: sql<string>`MAX(CASE WHEN ${ProductTranslation.lang} = ${LANGUAGES.ES} THEN ${ProductTranslation.lang} END)`
        },
        ptTranslation:{
            name: sql<string>`MAX(CASE WHEN ${ProductTranslation.lang} = ${LANGUAGES.PT} THEN ${ProductTranslation.name} END)`,
            review: sql<string>`MAX(CASE WHEN ${ProductTranslation.lang} = ${LANGUAGES.PT} THEN ${ProductTranslation.review} END)`,
            included: sql<string>`MAX(CASE WHEN ${ProductTranslation.lang} = ${LANGUAGES.PT} THEN ${ProductTranslation.included} END)`,
            specs: sql<string>`MAX(CASE WHEN ${ProductTranslation.lang} = ${LANGUAGES.PT} THEN ${ProductTranslation.specs} END)`,
            lang: sql<string>`MAX(CASE WHEN ${ProductTranslation.lang} = ${LANGUAGES.PT} THEN ${ProductTranslation.lang} END)`
        },
        category: {
            id: sql<string>`COALESCE(${Category.id}, '')`,
            name: sql<string>`COALESCE(${CategoryTranslation.name}, '')`
        },
        variants: sql<number>`(SELECT COUNT(*) FROM ${Variant} WHERE ${Variant.product_id} = ${Product.id})`
    }).from(ProductTranslation)
    .fullJoin(ProductTranslation, eq(ProductTranslation.product_id, Product.id))
    .fullJoin(Category, eq(Category.id, Product.category_id))
    .fullJoin(CategoryTranslation, eq(CategoryTranslation.category_id, Category.id))
    .fullJoin(Product, eq(Product.id, ProductTranslation.product_id))
    .groupBy(Product.id)
    .where(and(...filters))

    return result
}

export const deleteProduct = async (id: string | string[]) => {
  const ids = typeof id === "string" ? [id] : id;

  const result = await db.delete(Product).where(inArray(Product.id, ids));

  return result.rowsAffected > 0;
};

export const updateProduct = async (data: ProductsData) => {
    
    const resultES = db.update(ProductTranslation).set({
        name: data.esTranslation.name,
        review: data.esTranslation.review,
        included: data.esTranslation.included || null,
        specs: data.esTranslation.specs
    }).where(and(eq(ProductTranslation.product_id, data.id), eq(ProductTranslation.lang, LANGUAGES.ES)))

    const resultPT = db.update(ProductTranslation).set({
        name: data.ptTranslation.name,
        review: data.ptTranslation.review,
        included: data.ptTranslation.included || null,
        specs: data.ptTranslation.specs
    }).where(and(eq(ProductTranslation.product_id, data.id), eq(ProductTranslation.lang, LANGUAGES.PT)))

    const results = await Promise.all([resultES, resultPT])

    return results.every(result => result.rowsAffected > 0)
}

export const addData = async (data: ProductsData) => {
    
    await db.insert(Product).values({
        id: data.id,
        category_id: data.category.id
    })

    const resultES = db.insert(ProductTranslation).values({
        product_id: data.id,
        lang: LANGUAGES.ES,
        name: data.esTranslation.name,
        review: data.esTranslation.review,
        included: data.esTranslation.included || null,
        specs: data.esTranslation.specs
    })

    const resultPT = db.insert(ProductTranslation).values({
        product_id: data.id,
        lang: LANGUAGES.PT,
        name: data.esTranslation.name,
        review: data.esTranslation.review,
        included: data.esTranslation.included || null,
        specs: data.esTranslation.specs
    })

    const results = await Promise.all([resultES, resultPT])

    return results.every(result => result.rowsAffected > 0)
}
