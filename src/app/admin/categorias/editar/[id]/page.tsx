'use client'
import { Button, ButtonGroup, Divider, Input, Textarea } from "@heroui/react"
import { Icon } from "@iconify/react"
import { useParams, useRouter } from 'next/navigation'
import { fakeDelete, getData } from "../../api"
import { Category } from "@root/db/schema"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Trash, Undo2, Save } from "lucide-react"

export default function Page() {

    const params = useParams<{ id: string }>()

    const id = params.id

    const [originalCategory, setOriginalCategory] = useState<typeof Category.$inferSelect >({
        id: "",
        name: "",
        shortDescription: "",
        description: "",
    })

    const [category, setCategory] = useState<typeof Category.$inferSelect >({
        id: "",
        name: "",
        shortDescription: "",
        description: "",
    })

    useEffect (() => {
        getData({id}).then((category) => {
            setOriginalCategory(category[0])
            setCategory(category[0])
        })
    }, [] )


    const router = useRouter()
    const handleDelete = async () => {
        toast.promise(fakeDelete(id).then(
            (success)=>{
                if(success){
                    router.push("/admin/categorias")
                }
            }
        ), {
            loading: "Eliminando categoria",
            success: "Categoria eliminada",
            error: "Error al eliminar categoria"
        })
    }

    return <div className=" h-full  ">

        <div className=" w-full">
            
        <div className=" flex justify-between items-center lg:mt-7 lg:mb-5 my-12 flex-col lg:flex-row  gap-3">
                <h1 className=" text-2xl font-bold">
                    Editar Categoria 
                    <span className=" bg-default-50 ml-2">
                    [{id}]
                    </span>
                </h1>
                <div className=" flex gap-2">
                    <Button 
                        isIconOnly
                        variant="flat"
                        color="danger"
                        onPress={handleDelete}
                    >
                        <Trash size={20} />
                    </Button>

                    <ButtonGroup>
                        <Button
                            variant="flat"
                            onPress={
                                () => {
                                    setCategory(originalCategory)
                                    toast.success("Cambios cancelados")
                                }
                            }
                        >
                            <Undo2 className=" mr-2" size={20} />
                            Cancelar
                        </Button>                  
                        <Button
                        variant="flat"
                        >
                            Guardar
                            <Save className=" ml-2" size={20} />
                        </Button>
                    </ButtonGroup>

                </div>  

            </div>
            


            <div className=" flex flex-col gap-2 w-full ">

                <div className=" flex justify-center items-center w-full  gap-4 ">
                    <h2 className=" text-xl font-semibold my-5">
                        Español
                    </h2>
                    <Divider className=" my-7 flex-shrink-0 flex-1 flex-grow w-full" />
                    <div className=" size-[32px] flex-shrink">
                        <Icon icon="flag:py-4x3" className=" text-2xl" />
                    </div>
                </div>

                <Input
                    label="Nombre"
                    labelPlacement="inside"
                    value={category.name}
                    onChange={(e) => setCategory({ ...category, name: e.target.value })}
                >
                </Input>

                <Textarea
                    label="Descripcion corta"
                    labelPlacement="inside"
                    value={category.shortDescription}
                    onChange={(e) => setCategory({ ...category, shortDescription: e.target.value })}
                />

                <Textarea
                    label="Descripcion"
                    labelPlacement="inside"
                    value={category.description}
                    onChange={(e) => setCategory({ ...category, description: e.target.value })}
                />

                <div className=" flex justify-center items-center w-full  gap-4 ">
                    <h2 className=" text-xl font-semibold my-5">
                        Portugues
                    </h2>
                    <Divider className=" my-7 flex-shrink-0 flex-1 flex-grow w-full" />
                    <div className=" size-[32px] flex-shrink">
                    <Icon icon="flag:br-4x3" className=" text-2xl" />
                    </div>
                </div>

                <Input
                    label="Nombre"
                    labelPlacement="inside"
                    value={category.name}
                    onChange={(e) => setCategory({ ...category, name: e.target.value })}
                >
                </Input>

                <Textarea
                    label="Descripcion corta"
                    labelPlacement="inside"
                    value={category.shortDescription}
                    onChange={(e) => setCategory({ ...category, shortDescription: e.target.value })}
                />

                <Textarea
                    label="Descripcion"
                    labelPlacement="inside"
                    value={category.description}
                    onChange={(e) => setCategory({ ...category, description: e.target.value })}
                />
                
            </div>


        </div>

    </div>
}