'use client'
import { Button, ButtonGroup, Divider, Input, Textarea } from "@heroui/react"
import { Icon } from "@iconify/react"
import { useParams, useRouter } from 'next/navigation'
import { categoryTranslated, deleteCategories, saveData } from "../../api"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Trash, Undo2, Save } from "lucide-react"
import { getData } from "./api"
import { LANGUAGES } from "@/lib/constants"

const INITIAL_STATE: categoryTranslated = {
    [LANGUAGES.ES]: {
        lang: LANGUAGES.ES,
        data: [
            {
                id: "",
                category_id: "",
                name: "",
                description: "",
                shortDescription: ""
            }
        ]
    },
    [LANGUAGES.PT]: {
        lang: LANGUAGES.PT,
        data: [
            {
                id: "",
                category_id: "",
                name: "",
                description: "",
                shortDescription: ""
            }
        ]
    }
}

export default function Page() {

    const params = useParams<{ id: string }>()

    const id = params.id

    const [originalCategory, setOriginalCategory] = useState<categoryTranslated >(INITIAL_STATE)
    const [category, setCategory] = useState<categoryTranslated>(INITIAL_STATE)
    const [categoryToDelete, setCategoryToDelete] = useState<categoryTranslated | null>(null)

    useEffect (() => {
        getData({id, lang:['es', 'pt']}).then((category) => {
            // add the category to the state
            setCategory(category)
            setOriginalCategory(category)
            console.log(category)
        })
    }, [] )

    
    const handleSave = async () => {
        toast.promise(saveData(category).then(
            (success) => {
                if(success){
                    setOriginalCategory(category)
                }
            }
        ), {
            loading: "Guardando cambios",
            success: "Cambios guardados",
            error: "Error al guardar cambios"
        })
    }

    const router = useRouter()

    const handleDeleteModal = async () => {

        toast.promise(deleteCategories(id).then(
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

    const handleDelete = () => {
        setCategoryToDelete(category)
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
                        onPress={handleSave}
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
                    value={
                        category ?
                        category[LANGUAGES.ES].data[0].name
                        : undefined
                    }
                    onChange={(e) => setCategory(
                        {
                            ...category,
                            [LANGUAGES.ES]: {
                                lang: LANGUAGES.ES,
                                data: [
                                    {
                                        ...category[LANGUAGES.ES].data[0],
                                        name: e.target.value
                                    }
                                ]
                            }
                        }
                    )
                }
                >
                </Input>

                <Input
                    label="Descripcion corta"
                    labelPlacement="inside"
                    value={
                        category ?
                        category[LANGUAGES.ES].data[0].shortDescription
                        : undefined
                    }
                    onChange={
                        (e) => setCategory(
                            {
                                ...category,
                                [LANGUAGES.ES]: {
                                    lang: LANGUAGES.ES,
                                    data: [
                                        {
                                            ...category[LANGUAGES.ES].data[0],
                                            shortDescription: e.target.value
                                        }
                                    ]
                                }
                            }
                        )
                    }
                />

                <Textarea
                    label="Descripcion"
                    labelPlacement="inside"
                    value={
                        category ?
                        category[LANGUAGES.ES].data[0].description
                        : undefined
                    }
                    onChange={
                        (e) => setCategory(
                            {
                                ...category,
                                [LANGUAGES.ES]: {
                                    lang: LANGUAGES.ES,
                                    data: [
                                        {
                                            ...category[LANGUAGES.ES].data[0],
                                            description: e.target.value
                                        }
                                    ]
                                }
                            }
                        )
                    }
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
                    value={
                        category ?
                        category[LANGUAGES.PT].data[0].name
                        : undefined
                    }
                    onChange={(e) => setCategory(
                        {
                            ...category,
                            [LANGUAGES.PT]: {
                                lang: LANGUAGES.PT,
                                data: [
                                    {
                                        ...category[LANGUAGES.PT].data[0],
                                        name: e.target.value
                                    }
                                ]
                            }
                        }
                    )
                }
                >
                </Input>

                <Input
                    label="Descripcion corta"
                    labelPlacement="inside"
                    value={
                        category ?
                        category[LANGUAGES.PT].data[0].shortDescription
                        : undefined
                    }
                    onChange={
                        (e) => setCategory(
                            {
                                ...category,
                                [LANGUAGES.PT]: {
                                    lang: LANGUAGES.PT,
                                    data: [
                                        {
                                            ...category[LANGUAGES.PT].data[0],
                                            shortDescription: e.target.value
                                        }
                                    ]
                                }
                            }
                        )
                    }
                />

                <Textarea
                    label="Descripcion"
                    labelPlacement="inside"
                    value={
                        category ?
                        category[LANGUAGES.PT].data[0].description
                        : undefined
                    }
                    onChange={
                        (e) => setCategory(
                            {
                                ...category,
                                [LANGUAGES.PT]: {
                                    lang: LANGUAGES.PT,
                                    data: [
                                        {
                                            ...category[LANGUAGES.PT].data[0],
                                            description: e.target.value
                                        }
                                    ]
                                }
                            }
                        )
                    }
                />
                
            </div>


        </div>

    </div>
}