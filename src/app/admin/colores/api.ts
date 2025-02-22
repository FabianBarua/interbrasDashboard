"use server";

import { LANGUAGES } from "@/lib/constants";
import { db } from "@root/db/config";
import { Color, ColorTranslation } from "@root/db/schema";
import { and, eq, inArray, sql } from "drizzle-orm";

export interface ColorsData {
    id: string;
    name_es: string;
    name_pt: string;
}

export const getData = async (params?: {id?:string}) : Promise<ColorsData[]> => {

    const filters = []

    if (params?.id) {
        filters.push(eq(ColorTranslation.color_id, params.id))
    }

    const result = await db
    .select({
        id: ColorTranslation.color_id,
        name_es: sql<string>`MAX(CASE WHEN ${ColorTranslation.lang} = ${LANGUAGES.ES} THEN ${ColorTranslation.name} END)`,
        name_pt: sql<string>`MAX(CASE WHEN ${ColorTranslation.lang} = ${LANGUAGES.PT} THEN ${ColorTranslation.name} END)`,
    })
    .from(ColorTranslation)
    .groupBy(ColorTranslation.color_id)
    .where(and(...filters))

    return result
}

export const deleteColors = async (id: string | string[]) => {
  const ids = typeof id === "string" ? [id] : id;

  const result = await db.delete(Color).where(inArray(Color.id, ids));

  return result.rowsAffected > 0;
};

export const updateColor = async (data: ColorsData) => {
    
    const resultES = db.update(ColorTranslation).set({
        name: data.name_es
    }).where(
        and(
            eq(ColorTranslation.color_id, data.id),
            eq(ColorTranslation.lang, LANGUAGES.ES)
        )
    )

    const resultPT = db.update(ColorTranslation).set({
        name: data.name_pt
    }).where(
        and(
            eq(ColorTranslation.color_id, data.id),
            eq(ColorTranslation.lang, LANGUAGES.PT)
        )
    )

    const results = await Promise.all([resultES, resultPT])

    return results.every(result => result.rowsAffected > 0)
}

export const addData = async (data: ColorsData) => {
    
    await db.insert(Color).values({
        id: data.id
    })

    const resultES = db.insert(ColorTranslation).values({
        color_id: data.id,
        lang: LANGUAGES.ES,
        name: data.name_es
    })

    const resultPT = db.insert(ColorTranslation).values({
        color_id: data.id,
        lang: LANGUAGES.PT,
        name: data.name_pt
    })

    const results = await Promise.all([resultES, resultPT])

    return results.every(result => result.rowsAffected > 0)
}
