"use server";
import { db } from "@root/db/config";
import { Category, CategoryTranslation } from "@root/db/schema";
import { and, eq, SQL } from "drizzle-orm";
import { categoryTranslated } from "../../api";



export const getData = async (params?: { id?: string; lang?: string[] }) => {
  const filters: SQL<unknown>[] = [];

  if (params?.id) {
    filters.push(eq(Category.id, params.id));
  }

  const LANGS = typeof params?.lang === "string" ? [params.lang] : params?.lang || [];

  const data = await Promise.all(
    LANGS.map(async (lang) => {
      const category = await db
        .select({
          id: Category.id,
          category_id: CategoryTranslation.category_id,
          name: CategoryTranslation.name,
          description: CategoryTranslation.description,
          shortDescription: CategoryTranslation.shortDescription,
        })
        .from(Category)
        .fullJoin(
          CategoryTranslation,
          and(eq(Category.id, CategoryTranslation.category_id))
        )
        .where(and(eq(CategoryTranslation.lang, lang), ...filters));

      return {
        lang,
        data: category,
      };
    })
  );

  const result: categoryTranslated = data.reduce((acc, curr) => {
    // @ts-ignore
    acc[curr.lang] = curr;
    return acc;
  }, {} as categoryTranslated);

  return result;
};
