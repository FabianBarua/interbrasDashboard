'use client'
import { Button, ButtonGroup, Form, Input, Textarea } from "@heroui/react"
import { useRouter } from 'next/navigation'
import { addData, ColorsData } from "../api"
import { toast } from "sonner"

import { Save } from "lucide-react"


export default function Page() {

    const router = useRouter()

    const onSubmit = (e: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined }) => {
        e.preventDefault();
    
        const data = Object.fromEntries(new FormData(e.currentTarget));

        const { id, name_es, name_pt } = data
        
        const color: ColorsData =  {
            id: id.toString(),
            name_es: name_es.toString(),
            name_pt: name_pt.toString()
        }

        addData(color)
        .then(() => {
            toast.success("Categoria guardada")
            router.push("/admin/colores")

        })
        .catch((e) => {
            toast.error(e.message || "Error al guardar")
        })

        
      };

    return <div className=" h-full  ">

        <Form className=" w-full" validationBehavior="native" onSubmit={onSubmit} >

            <div className=" flex w-full justify-between items-center lg:mt-7 lg:mb-5 my-12 flex-col lg:flex-row  gap-3">
                <h1 className=" text-2xl font-bold">
                    Agregar Color
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

                <Input
                    label="Nombre ES"
                    labelPlacement="inside"
                    name="name_es"
                    isRequired
                >
                </Input>

                <Input
                    label="Nombre PT"
                    labelPlacement="inside"
                    name="name_pt"
                    isRequired
                >
                </Input>


            </div>


        </Form>

    </div>
}

