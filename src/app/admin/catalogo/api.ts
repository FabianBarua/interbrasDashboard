"use server";

import { LANGUAGES } from "@/lib/constants";
import { db } from "@root/db/config";
import { Catalog, StatusTranslation } from "@root/db/schema";
import { and, eq, inArray, sql } from "drizzle-orm";

interface translation {
    status: string
}

export interface CatalogData {
    catalog: typeof Catalog.$inferSelect;
    es: translation;
    pt: translation;
}

export const getData = async (params?: {id?:number}) : Promise<CatalogData[]> => {

    const filters = []

    if (params?.id) {
        filters.push(eq(Catalog.id, params.id))
    }

    const result : CatalogData[] = await db.select({
        catalog: Catalog,
        es: {
            status: sql<string>`MAX(CASE WHEN ${StatusTranslation.lang} = ${LANGUAGES.ES} THEN ${StatusTranslation.name} END)`
        },
        pt: {
            status: sql<string>`MAX(CASE WHEN ${StatusTranslation.lang} = ${LANGUAGES.PT} THEN ${StatusTranslation.name} END)`
        }
    }).from(Catalog)
    .fullJoin(StatusTranslation, eq(StatusTranslation.status_id, Catalog.status_id))
    .groupBy(Catalog.id)
    .where(and(...filters)) as CatalogData[]

    return result
}

export const deleteCatalog = async (id: number | number[]) => {
  const ids = typeof id === "number" ? [id] : id;
  const result = await db.delete(Catalog).where(inArray(Catalog.id, ids));
  return result.rowsAffected > 0;
};

export const updateCatalog = async (data: CatalogData) => {
    return true
}

export const addData = async (data: CatalogData) => {

    return true
    
}