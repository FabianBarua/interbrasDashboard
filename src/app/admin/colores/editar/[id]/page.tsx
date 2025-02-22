'use client'

import { Button, ButtonGroup, Form, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { deleteColors, getData, updateColor, type ColorsData } from '../../api'
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trash, Undo2, Save } from "lucide-react";
import { toast } from "sonner";
import { DeleteColorModal } from "../../tables";



export default function Page() {

    const [originalColor, setOriginalColor] = useState<ColorsData | null>(null)
    const [color, setColor] = useState<ColorsData | null>(null)
    const [colorToDelete, setColorToDelete] = useState<ColorsData | null>(null)
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const params = useParams<{ id: string }>()
    const id = params.id

    const router = useRouter()

    useEffect(() => {
        getData({id: id}).then((color) => {
            console.log(color)
            setOriginalColor(color[0])
            setColor(color[0])
        })
    }, [])

    const handleEdit = ({
        name,
        value
    }: { name: string, value: string }) => {
        setColor(prevColor => ({
            ...prevColor,
            [name]: value
        } as ColorsData))
    }


    const handleSave = () => {
        
        if (color) {
            updateColor(color).then((result) => {
                if(result) {
                    setOriginalColor(color)
                    toast.success("Cambios guardados")
                } else {
                    toast.error("Error al guardar los cambios")
                }
            })
        } else {
            toast.error("Color no válido")
        }

    }

    const handleDeleteModal = () => {
        deleteColors(id).then((result) => {
            if(result) {
                toast.success("Color eliminado")
                router.push("/admin/colores")
            } else {
                toast.error("Error al eliminar el color")
            }
        }
        )
    }

    const handleOpenDelete = useCallback((color: ColorsData) => {
        setColorToDelete(color);
        onOpen();
    } , [onOpen]);

    return (
        <>

            <DeleteColorModal isOpen={isOpen} onOpenChange={onOpenChange} color={colorToDelete} onDelete={handleDeleteModal} />


            <div className=" flex justify-between items-center lg:mt-7 lg:mb-5 my-12 flex-col lg:flex-row  gap-3">
                <h1 className=" text-2xl font-bold">
                    Editar Color 
                    <span className=" bg-default-50 ml-2">
                    [{id}]
                    </span>
                </h1>
                <div className=" flex gap-2">
                    <Button 
                        isIconOnly
                        variant="flat"
                        color="danger"
                        onPress={
                            ()=>{
                                color && handleOpenDelete(color)
                            }
                        }
                    >
                        <Trash size={20} />
                    </Button>

                    <ButtonGroup>
                        <Button
                            variant="flat"
                            onPress={
                                () => {
                                    setColor(originalColor)
                                    toast.success("Cambios cancelados")
                                }
                            }
                        >
                            <Undo2 className=" mr-2" size={20} />
                            Cancelar
                        </Button>                  
                        <Button
                        variant="flat"
                        onPress={handleSave}
                        >
                            Guardar
                            <Save className=" ml-2" size={20} />
                        </Button>
                    </ButtonGroup>

                </div>  

            </div>
            

            <Form>
                <Input
                label="ID"
                labelPlacement="inside"
                isRequired
                name="id"
                value={color?.id}
                disabled
                />

                <Input
                label="Color - Español"
                labelPlacement="inside"
                isRequired
                name="color_es"
                value={color?.name_es}
                disabled={originalColor===null}
                onChange={
                    (e) => handleEdit({
                        name: "name_es",
                        value: e.target.value
                    })
                }
                />

                <Input
                label="Color - Portugués"
                labelPlacement="inside"
                isRequired
                name="color_pt"
                value={color?.name_pt}
                disabled={originalColor===null}
                onChange={
                    (e) => handleEdit({
                        name: "name_pt",
                        value: e.target.value
                    })
                }
                />
                
            </Form>
        
        </>
    )
}