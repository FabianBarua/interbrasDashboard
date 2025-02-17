'use client'
import { Button, ButtonGroup, Divider, Input, Textarea } from "@heroui/react"
import { Icon } from "@iconify/react"
import { useParams, useRouter } from 'next/navigation'
import { fakeDelete, getData } from "../api"
import { Category } from "@root/db/schema"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Trash, Undo2, Save } from "lucide-react"

export default function Page() {


    const [category, setCategory] = useState<typeof Category.$inferSelect >({
        id: "",
        name: "",
        shortDescription: "",
        description: "",
    })


    const router = useRouter()


    return <div className=" h-full  ">

        <div className=" w-full">
            
        <div className=" flex justify-between items-center lg:mt-7 lg:mb-5 my-12 flex-col lg:flex-row  gap-3">
                <h1 className=" text-2xl font-bold">
                    Agregar categoria
                </h1>
                <div className=" flex gap-2">
  

                    <ButtonGroup>          
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