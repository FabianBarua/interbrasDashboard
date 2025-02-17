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
import { Category, Product } from "@root/db/schema";
import { Loader } from "lucide-react";
import { useState, useEffect } from "react";

interface productRow {
    product: typeof Product.$inferSelect
    category: typeof Category.$inferSelect
}

export const ProductsTable = ({
    products
}: {
    products: productRow[],
    categories: typeof Category.$inferSelect[]
}) => {

    const [loaded, setLoaded] = useState(false);
    
    useEffect(() => {
        setLoaded(
            (products.length > 0)
        );
    } , [products]);
    
    if (!loaded) {
        return <div className=" mx-auto my-auto flex gap-2 items-center justify-center">
            <Loader size={20}  className=" animate-spin text-primary-500 "/> 
            <p>
                Cargando
            </p>
        </div>;
    }

    const columns = [
        { key: 'key', label: 'ID' },
        { key: 'name', label: 'Nombre' },
        { key: 'category', label: 'Categoría' },
    ];

    const rows = products.map((product) => ({
        key: product.product.id,
        name: product.product.name,
        category: product.category,
    }));


    return (
        <>
            <Table 
                selectionMode="multiple"
                aria-label="Example table with dynamic content"
                className="mt-2"
                >
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
                            <TableCell>{row.category.name}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    )
}
