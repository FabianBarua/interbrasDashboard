'use client'
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
} from "@heroui/react";
import { Category, Color, Photo, Product, Variant, Volt } from "@root/db/schema";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

interface variantRow {
    variant: typeof Variant.$inferSelect,
    product: typeof Product.$inferSelect,
    color : typeof Color.$inferSelect,
    volt : typeof Volt.$inferSelect,
    photo : typeof Photo.$inferSelect
}

export const CustomTable = () => {


    return (
        <>
            {/* <Table aria-label="Example table with dynamic content" className="mt-2">
                <TableHeader>
                    {columns.map((column) =>
                        <TableColumn key={column.key}>{column.label}</TableColumn>
                    )}
                </TableHeader>
                <TableBody>
                    {rows.map((row) =>
                        <TableRow key={row.key}>
                            <TableCell>{row.key}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.color}</TableCell>
                            <TableCell>{row.volt}</TableCell>
                            <TableCell>
                                <Image
                                    src={`https://interbrasoficial.com${row.photo}`}
                                    alt="Product photo"
                                    width={50}
                                    height={50}
                                />
                            </TableCell>

                        </TableRow>
                    )}
                </TableBody>
            </Table> */}
            <Button className="mt-4">Save</Button>
        </>
    )
}