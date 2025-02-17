'use server'

import { db } from "@root/db/config"
import { Category } from "@root/db/schema"

export const getData = async () => {
    return await db.select().from(Category)
}

export const fakeDelete = async (id: string | string[]) => {
    console.log('Deleting', id)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return true
}
