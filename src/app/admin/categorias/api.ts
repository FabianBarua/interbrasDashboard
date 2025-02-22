"use server";

import { DEFAULT_LANGUAGE, LANGUAGES } from "@/lib/constants";
import { db } from "@root/db/config";
import { Category, CategoryTranslation } from "@root/db/schema";
import { and, eq, inArray } from "drizzle-orm";

export interface CategoryData {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
}
export interface categoryTranslated {
  [lang: string]: {
    lang: string;
    data: {
      id: string | null;
      category_id: string;
      name: string;
      description: string;
      shortDescription: string;
    }[];
  };
}

export const getData = async (params?: {
  id?: string;
  lang: string;
}): Promise<CategoryData[]> => {
  const filters = [];

  if (params?.id) {
    filters.push(eq(Category.id, params.id));
  }

  const lang = params?.lang || DEFAULT_LANGUAGE;

  const result = db
    .select({
      id: Category.id,
      name: CategoryTranslation.name,
      description: CategoryTranslation.description,
      shortDescription: CategoryTranslation.shortDescription,
    })
    .from(Category)
    .fullJoin(
      CategoryTranslation,
      eq(CategoryTranslation.category_id, Category.id)
    )
    .where(and(eq(CategoryTranslation.lang, lang), ...filters));

  const data = await result;
  return data.map(item => ({
    id: item.id || '',
    name: item.name || '',
    description: item.description || '',
    shortDescription: item.shortDescription || ''
  }));
};

export const deleteCategories = async (id: string | string[]) => {
  const ids = typeof id === "string" ? [id] : id;

  const result = await db.delete(Category).where(inArray(Category.id, ids));

  return result.rowsAffected > 0;
};

export const saveData = async (category: categoryTranslated) => {
  let success = true;

  for (const lang of Object.keys(LANGUAGES) as (keyof typeof LANGUAGES)[]) {
    const locale = LANGUAGES[lang];
    const data = category[locale].data;
    for (const item of data) {
      try {
        const result = await db
          .update(CategoryTranslation)
          .set({
            name: item.name,
            description: item.description,
            shortDescription: item.shortDescription,
          })
          .where(
            and(
              eq(CategoryTranslation.category_id, item.category_id),
              eq(CategoryTranslation.lang, locale)
            )
          );

        success = success === false ? false : result.rowsAffected > 0;
      } catch (error) {
        success = false;
      }
    }
  }

  if (!success) {
    throw new Error("Error al guardar los datos");
  }

  return success;
};

export const addData = async (category: categoryTranslated) => {
  let success = true;

  // Obtener todos los ids únicos
  const all_ids = Object.values(category)
    .map((item) => item.data.map((i) => i.category_id))
    .flat()
    .filter((value, index, self) => self.indexOf(value) === index);

  for (const categoryId of all_ids) {
    // Verificar si existe
    const exists = await db.select().from(Category).where(eq(Category.id, categoryId));

    if (exists.length > 0) {
      throw new Error("Existe una categoría con el mismo id");
    }

    const result = await db.insert(Category).values({ id: categoryId });
    console.log(result);
  }

  for (const lang of Object.keys(LANGUAGES) as (keyof typeof LANGUAGES)[]) {
    const locale = LANGUAGES[lang];
    const data = category[locale].data;

    await Promise.all(
      data.map(async (item) => {
        const result = await db.insert(CategoryTranslation).values({
          category_id: item.category_id,
          lang: locale,
          name: item.name,
          description: item.description,
          shortDescription: item.shortDescription,
        });

        console.log(result);
        if (result.rowsAffected === 0) success = false;
      })
    );
  }

  if (!success) {
    throw new Error("Error al guardar los datos");
  }

  return success;
};
