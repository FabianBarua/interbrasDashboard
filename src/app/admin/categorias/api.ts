'use server'

import { db } from "@root/db/config"
import { Category } from "@root/db/schema"

export const getData = async () => {
    return await db.select().from(Category)
}