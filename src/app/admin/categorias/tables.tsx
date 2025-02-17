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
import { Category } from "@root/db/schema";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { ChevronDown, CirclePlus, Loader, Pen, Trash } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { getData } from "./api";

const fakeDelete = async (id: string | string[]) => {
    console.log('Deleting', id)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return true
}

const DeleteCategoryModal = ({ isOpen, onOpenChange, category, onDelete }: any) => {
    return (
        <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <h3>Eliminar categoría</h3>
                        </ModalHeader>
                        <ModalBody>
                            <p>¿Estás seguro que deseas eliminar la categoría <strong>{category?.name}</strong>?</p>
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

    const [categories, setCategories] = useState<typeof Category.$inferSelect[]>([])
    const updateCategories = ()=>{getData().then((data) => {setCategories(data)})}

    useEffect(() => {
        updateCategories()
    }, [])

    const [search, setSearch] = useState('')

    const categoriesFiltered = useMemo(() => categories.filter((category) => {
        return category.name.toLowerCase().includes(search.toLowerCase());
    }), [categories, search])

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Nombre' },
        { key: 'description', label: 'Descripción' },
        { key: 'shortDescription', label: 'Descripción corta' },
        { key: 'actions', label: 'Acciones' }
    ];

    const router = useRouter()
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [categoryToDelete, setCategoryToDelete] = useState<typeof Category.$inferSelect | null>(null)

    const handleOpenDelete = useCallback((category: typeof Category.$inferSelect) => {
        setCategoryToDelete(category);
        onOpen();
    }, [onOpen]);

    const handleDelete = useCallback(async (onClose: () => void) => {
        if (categoryToDelete) {
            toast.promise(
                fakeDelete(categoryToDelete.id).then((success) => {
                    if (success) {
                        setCategories((categories) => categories.filter((c) => c.id !== categoryToDelete.id));
                        setSelectedKeys((prev) => new Set([...prev].filter((key) => key !== categoryToDelete.id)));
                        setCategoryToDelete(null);
                        onClose();
                    }
                }),
                {
                    loading: 'Borrando categoría',
                    success: 'Categoría borrada',
                    error: 'Error borrando la categoría'
                }
            );
        }
    }, [categoryToDelete]);

    const [selectedKeys, setSelectedKeys] = useState<Set<any> | 'all'>(new Set<any>());

    const [loaded, setLoaded] = useState(false);

    const firstRender = useRef(true);
    
    useEffect(() => {
        if (firstRender.current && categories.length) {
            setLoaded(true);
            firstRender.current = false;
        }
    }, [categories]);

    if (!loaded) {
        return <div className=" mx-auto my-auto flex gap-2 items-center justify-center">
            <Loader size={20} className=" animate-spin text-primary-500 " />
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
                fakeDelete('all').then((success) => {
                    if (success) {
                        setCategories([]);
                        setSelectedKeys(new Set());
                    }
                }),
                {
                    loading: 'Borrando categorías',
                    success: 'Categorías borradas',
                    error: 'Error borrando las categorías'
                }
            )
        }

        if (selectedKeys instanceof Set && selectedKeys.size) {
            toast.promise(
                fakeDelete(Array.from(selectedKeys)).then((success) => {
                    if (success) {
                        setCategories((categories) => categories.filter((c) => !selectedKeys.has(c.id)));
                        setSelectedKeys(new Set());
                    }
                }),
                {
                    loading: 'Borrando categorías',
                    success: 'Categorías borradas',
                    error: 'Error borrando las categorías'
                }
            )

    }
    }

    return (
        <>
            <DeleteCategoryModal isOpen={isOpen} onOpenChange={onOpenChange} category={categoryToDelete} onDelete={handleDelete} />
            <div className="w-full flex justify-between items-end my-4">
                <Input className="max-w-xs" label="Buscar" labelPlacement="outside" placeholder="Buscar categoría"
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

                    <Button as={Link} href="/admin/categorias/agregar" className="max-w-min" variant="flat">
                        <CirclePlus className="mr-2" size={20} />
                        Agregar categoría
                    </Button>
                </div>
            </div>
            <Table
                aria-label="Product table"
                selectedKeys={selectedKeys}
                selectionMode="multiple"
                onSelectionChange={(keys) => {
                    setSelectedKeys(keys as Set<string>)
                    console.log(keys)
                }
                }
            >
                <TableHeader>
                    {columns.map((column) => <TableColumn key={column.key}>{column.label}</TableColumn>)}
                </TableHeader>
                <TableBody>
                    {categoriesFiltered.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>{row.id}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.description}</TableCell>
                            <TableCell>{row.shortDescription}</TableCell>
                            <TableCell className="gap-2 flex">
                                <Button size="sm" isIconOnly variant="light" onPress={() => handleOpenDelete(row)}>
                                    <Trash className="text-default-400" size={20} />
                                </Button>
                                <Button size="sm" isIconOnly variant="light" onPress={() => {
                                    router.push(`/admin/categorias/editar/${row.id}`);
                                }}>
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
