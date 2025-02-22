'use client'
import { Button, ButtonGroup, Divider, Form, Input, Textarea } from "@heroui/react"
import { Icon } from "@iconify/react"
import { useRouter } from 'next/navigation'
import { addData, categoryTranslated, saveData } from "../api"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Save } from "lucide-react"
import { LANGUAGES } from "@/lib/constants"


export default function Page() {

    const router = useRouter()

    const onSubmit = (e: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined }) => {
        e.preventDefault();
    
        const data = Object.fromEntries(new FormData(e.currentTarget));

        const category: categoryTranslated = {
            [LANGUAGES.ES]: {
                lang: LANGUAGES.ES,
                data: [
                    {
                        id: null,
                        category_id: data.id as string,
                        name: data["name-es"] as string,
                        description: data["desc-es"] as string,
                        shortDescription: data["desc-short-es"] as string
                    }
                ]
            },
            [LANGUAGES.PT]: {
                lang: LANGUAGES.PT,
                data: [
                    {
                        id: null,
                        category_id: data.id as string,
                        name: data["name-pt"] as string,
                        description: data["desc-pt"] as string,
                        shortDescription: data["desc-short-pt"] as string
                    }
                ]
            } 
        }

        addData(category)
        .then(() => {
            toast.success("Categoria guardada")
            router.push("/admin/categorias")

        })
        .catch(() => {
            toast.error("Error al guardar")
        })

        
      };

    return <div className=" h-full  ">

        <Form className=" w-full" validationBehavior="native" onSubmit={onSubmit} >

            <div className=" flex w-full justify-between items-center lg:mt-7 lg:mb-5 my-12 flex-col lg:flex-row  gap-3">
                <h1 className=" text-2xl font-bold">
                    Agregar categoria
                </h1>
                <div className=" flex gap-2">

                    <ButtonGroup>
                        <Button
                            variant="flat"
                            type="submit"
                        >
                            Guardar
                            <Save className=" ml-2" size={20} />
                        </Button>
                    </ButtonGroup>

                </div>

            </div>

            <div className=" flex flex-col gap-2 w-full ">

                <Input
                    label="ID"
                    labelPlacement="inside"
                    name="id"
                    isRequired
                >
                </Input>

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
                    name="name-es"
                    isRequired
                >
                </Input>

                <Input
                    label="Descripcion corta"
                    labelPlacement="inside"
                    name="desc-short-es"
                    isRequired
                />

                <Textarea
                    label="Descripcion"
                    labelPlacement="inside"
                    name="desc-es"
                    isRequired
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
                    name="name-pt"
                    isRequired
                >
                </Input>

                <Input
                    label="Descripcion corta"
                    labelPlacement="inside"
                    name="desc-short-pt"
                    isRequired
                />

                <Textarea
                    label="Descripcion"
                    labelPlacement="inside"
                    name="desc-pt"
                    isRequired
                />

            </div>


        </Form>

    </div>
}