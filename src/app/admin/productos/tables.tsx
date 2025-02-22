'use client'
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Input,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Listbox,
    ListboxItem
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { ChevronDown, CirclePlus, Loader, Pen, Trash } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { ProductsData, deleteProduct, getData } from "./api";
import { Color } from "@root/db/schema";

export const DeleteColorModal = ({ isOpen, onOpenChange, color, onDelete }: any) => {
    return (
        <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <h3>Eliminar Color</h3>
                        </ModalHeader>
                        <ModalBody>
                            <p>¿Estás seguro que deseas eliminar el color <strong>{color?.name_es}</strong>?</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onPress={onClose}>
                                Cancelar
                            </Button>
                            <Button color="danger" variant="flat" onPress={() => onDelete(onClose)}>
                                Eliminar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export const CustomTable = () => {

    const [selectedKeys, setSelectedKeys] = useState<Set<any> | 'all'>(new Set<any>());
    const router = useRouter();

    const columns = [
        {
            key: 'id',
            label: 'ID'
        },
        {
            key: 'name',
            label: 'Nombre'
        },
        {
            key: 'category',
            label: 'Categoría'
        },
        {
            key: 'variantes',
            label: 'Variantes'
        },
        {
            key: 'actions',
            label: 'Acciones'
        }
    ]

    const [products, setProducts] = useState<ProductsData[] | null>(null)

    const [ProductToDelete, setColorToDelete] = useState<typeof Color.$inferSelect | null>(null)
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleDelete = useCallback(async (onClose: () => void) => {
            if (ProductToDelete) {
                toast.promise(
                    deleteProduct(ProductToDelete.id).then((success) => {
                        if (success && products) {
                            setProducts(() => products.filter((c) => c.id !== ProductToDelete.id));
                            setSelectedKeys((prev) => new Set([...prev].filter((key) => key !== ProductToDelete.id)));
                            setColorToDelete(null);
                            onClose();
                        }
                    }),
                    {
                        loading: 'Borrando producto',
                        success: 'Producto borrado',
                        error: 'Error borrando el producto'
                    }
                );
            }
        }, [ProductToDelete]);

    const updateColors = ()=>{
        getData().then((data) => {
        setProducts(data)
    })
    }

    useEffect(() => {
        updateColors()
    }, [])


    const [search, setSearch] = useState('')

    const productsFiltered = useMemo(() => products?.filter((product) => {
        return product.esTranslation.name?.toLowerCase().includes(search.toLowerCase()) || product.esTranslation.name?.toLowerCase().includes(search.toLowerCase())
    }), [products, search])

    const handleOpenDelete = useCallback((color: ProductsData) => {
        setColorToDelete(color);
        onOpen();
    } , [onOpen]);

    const [loaded, setLoaded] = useState(false);

    const firstRender = useRef(true);
    
    useEffect(() => {
        if (firstRender.current && products!== null) {
            setLoaded(true);
            firstRender.current = false;
        }
    }, [products]);

    if (!loaded) {
        return <div className=" mx-auto my-auto flex gap-2 items-center justify-center">
            <Loader size={20} className="animate-spin text-primary-500 " />
            <p>
                Cargando
            </p>
        </div>;
    }


        const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;
            setSearch(value);
        }
    
        const bulkDelete = async () => {
            if (selectedKeys === 'all') {
                toast.promise(
                    deleteProduct(products?.map((color) => color.id) || []).then(
                        () => {
                            updateColors()
                            setSelectedKeys(new Set())
                        }
                    )
                    ,
                    {
                        loading: 'Borrando colores',
                        success: 'Colores borradas',
                        error: 'Error borrando los colores'
                    }
                )
            }
    
            if (selectedKeys instanceof Set && selectedKeys.size) {
                toast.promise(
                    deleteProduct(Array.from(selectedKeys)).then(
                        () => {
                            updateColors()
                            setSelectedKeys(new Set())
                        }
                    )
                        ,
                    {
                        loading: 'Borrando Colores',
                        success: 'Colores borrados',
                        error: 'Error borrando los colores'
                    }
                )
    
        }
        }

    return (
        <>

        <DeleteColorModal isOpen={isOpen} onOpenChange={onOpenChange} color={ProductToDelete} onDelete={handleDelete} />


        <div className="w-full flex justify-between items-end my-4">
                <Input className="max-w-xs" label="Buscar" labelPlacement="outside" placeholder="Buscar colores"
                    onChange={handleSearch}
                />

                <div className=" flex gap-2  w-full justify-end items-end">

                    {((selectedKeys instanceof Set && selectedKeys.size) || selectedKeys === 'all') && (
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}

                        >
                            <Popover showArrow placement="bottom" backdrop="blur" >
                                <PopoverTrigger>
                                    <Button variant="flat" color="primary" className=" "  >
                                        <ChevronDown size={20} />
                                        Multiple acciones
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-1" >

                                    <Listbox aria-label="Listbox menu with icons" variant="faded">
                                        <ListboxItem
                                            key="delete"
                                            className="text-danger border border-content2"
                                            color="danger"
                                            variant="faded"
                                            startContent={<Icon icon={"solar:trash-bin-trash-bold"} />}
                                            onPress={bulkDelete}
                                        >
                                            Borrar seleccionados
                                        </ListboxItem>
                                    </Listbox>

                                </PopoverContent>
                            </Popover>
                        </motion.div>
                    )
                    }

                    <Button as={Link} href="/admin/colores/agregar" className="max-w-min" variant="flat">
                        <CirclePlus className="mr-2" size={20} />
                        Agregar color
                    </Button>
                </div>
        </div>

            <Table
                aria-label="Product table"
                selectedKeys={selectedKeys}
                selectionMode="multiple"
                onSelectionChange={(keys) => {
                    setSelectedKeys(keys as Set<string>)
                }
                }
                className=" pb-4"
            >
                <TableHeader>
                    {columns.map((column) => <TableColumn key={column.key}>{column.label}</TableColumn>)}
                </TableHeader>
                <TableBody>
                    {(productsFiltered || []).map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>{row.id}</TableCell>
                            <TableCell>{row.esTranslation.name}</TableCell>
                            <TableCell>{row.category.name}</TableCell>
                            <TableCell className="gap-2 flex">
                                <Button size="sm" isIconOnly variant="light" onPress={() => handleOpenDelete(row)}>
                                    <Trash className="text-default-400" size={20} />
                                </Button>
                                <Button size="sm" isIconOnly variant="light" as={Link} href={`/admin/colores/editar/${row.id}`}>
                                    <Pen className="text-default-400" size={20} />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}
