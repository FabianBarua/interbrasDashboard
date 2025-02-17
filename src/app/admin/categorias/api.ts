'use server'

import { db } from "@root/db/config"
import { Category } from "@root/db/schema"
import { and, eq } from "drizzle-orm"

export const getData = async (params?: { id?: string }) => {
    const filters= []
    if (params?.id) {
        filters.push(eq(Category.id, params.id))
    }
    return await db.select().from(Category).where(and(...filters))
}

export const fakeDelete = async (id: string | string[]) => {
    console.log('Deleting', id)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return true
}
