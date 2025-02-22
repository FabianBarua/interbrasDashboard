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
    ListboxItem,
    Checkbox
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { ChevronDown, CirclePlus, Key, Loader, Pen, Trash } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { Catalog } from "@root/db/schema";
import { deleteCatalog, getData } from "./api";
import type { CatalogData } from "./api";

export const DeleteColorModal = ({ isOpen, onOpenChange, catalog, onDelete }: any) => {
    return (
        <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <h3>Eliminar Color</h3>
                        </ModalHeader>
                        <ModalBody>
                            <p>¿Estás seguro que deseas eliminar el item <strong>{catalog.name}</strong>?</p>
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
            key: 'system_name',
            label: 'Nombre de sistema'
        },
        {
            key: 'price',
            label: 'Precio'
        },
        {
            key: 'show',
            label: 'Mostrar'
        },
        {
            key: 'actions',
            label: 'Acciones'
        }
    ]
    const [catalog, setCatalog] = useState<CatalogData[] | null>(null)
    const [catalogToDelete, setCatalogToDelete] = useState<typeof Catalog.$inferSelect | null>(null)
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleDelete = useCallback(async (onClose: () => void) => {
            if (catalogToDelete) {
                toast.promise(
                    deleteCatalog(catalogToDelete.id).then((success) => {
                        if (success) {
                            setCatalog((catalog) => catalog ? catalog.filter((c) => c.catalog.id !== catalogToDelete.id) : null);
                            setSelectedKeys((prev) => new Set([...prev].filter((key) => key !== catalogToDelete.id)));
                            setCatalogToDelete(null);
                            onClose();
                        }
                    }),
                    {
                        loading: 'Borrando item',
                        success: 'Item borrado',
                        error: 'Error borrando el item'
                    }
                );
            }
        }, [catalogToDelete]);

    const updateCatalog = ()=>{
        getData().then((data) => {
        setCatalog(data)
    })
    }

    useEffect(() => {
        updateCatalog()
    }, [])


    const [search, setSearch] = useState('')

    const catalogFiltered = useMemo(() => catalog?.filter((catalog_filter) => {
        return catalog_filter.catalog.name?.toLowerCase().includes(search.toLowerCase())
    }), [catalog, search])

    const handleOpenDelete = useCallback((catalog: typeof Catalog.$inferSelect ) => {
        setCatalogToDelete(catalog);
        onOpen();
    } , [onOpen]);

    const [loaded, setLoaded] = useState(false);

    const firstRender = useRef(true);
    
    useEffect(() => {
        if (firstRender.current && catalog!== null) {
            setLoaded(true);
            firstRender.current = false;
        }
    }, [catalog]);

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
                    deleteCatalog(catalog?.map((item) => item.catalog.id) || []).then(
                        () => {
                            updateCatalog()
                            setSelectedKeys(new Set())
                        }
                    )
                    ,
                    {
                        loading: 'Borrando items',
                        success: 'Item borrados',
                        error: 'Error borrando los items'
                    }
                )
            }
    
            if (selectedKeys instanceof Set && selectedKeys.size) {
                toast.promise(
                    deleteCatalog(Array.from(selectedKeys)).then(
                        () => {
                            updateCatalog()
                            setSelectedKeys(new Set())
                        }
                    )
                        ,
                    {
                        loading: 'Borrando item',
                        success: 'Items borrados',
                        error: 'Error borrando los items'
                    }
                )
    
        }
        }

    return (
        <>

        <DeleteColorModal isOpen={isOpen} onOpenChange={onOpenChange} catalog={catalogToDelete} onDelete={handleDelete} />


        <div className="w-full flex justify-between items-end my-4">
                <Input className="max-w-xs" label="Buscar" labelPlacement="outside" placeholder="Buscar item"
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

                    <Button as={Link} href="/admin/item/agregar" className="max-w-min" variant="flat">
                        <CirclePlus className="mr-2" size={20} />
                        Agregar item
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
                    {(catalogFiltered|| []).map((row) => (
                        <TableRow key={row.catalog.id}>
                            <TableCell>{row.catalog.id}</TableCell>
                            <TableCell>{row.catalog.name}</TableCell>
                            <TableCell>{row.catalog.price}</TableCell>
                            <TableCell>
                                 <Checkbox 
                                    defaultChecked={row.catalog.show}
                                 >Option</Checkbox>
                            </TableCell>
                            <TableCell className="gap-2 flex">
                                <Button size="sm" isIconOnly variant="light" onPress={() => handleOpenDelete(row.catalog)}>
                                    <Trash className="text-default-400" size={20} />
                                </Button>
                                <Button size="sm" isIconOnly variant="light" as={Link} href={`/admin/item/editar/${row.catalog.id}`}>
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
