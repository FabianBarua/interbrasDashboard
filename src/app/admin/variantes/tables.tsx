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

export const CustomTable = ({
    variants
}: {
    variants: variantRow[],
    categories: typeof Category.$inferSelect[]
}) => {

    const columns = [
        { key: 'key', label: 'ID' },
        { key: 'name', label: 'Nombre' },
        { key: 'color', label: 'Color' },
        { key: 'volt', label: 'Voltaje' },
        { key: 'photo', label: 'Foto' },
    ];

    const rows = variants.map((product) => ({
        key: product.variant.id,
        name: product.product.name,
        color: product.color.color,
        volt: product.volt.name || 'No voltaje',
        photo: product.photo.url
    }));

    const [loaded, setLoaded] = useState(false);
    
    useEffect(() => {
        setLoaded(
            (variants.length > 0)
        );
    } , [variants]);
    
    if (!loaded) {
        return <div className=" mx-auto my-auto flex gap-2 items-center justify-center">
            <Loader size={20}  className=" animate-spin text-primary-500 "/> 
            <p>
                Cargando
            </p>
        </div>;
    }


    return (
        <>
            <Table aria-label="Example table with dynamic content" className="mt-2">
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
            </Table>
            <Button className="mt-4">Save</Button>
        </>
    )
}