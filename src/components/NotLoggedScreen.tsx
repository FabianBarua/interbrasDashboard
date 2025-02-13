'use client'
import { LOGIN } from "@/lib/routes";
import { Card, CardHeader, Button } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const NotLoggedScreen = () => {
    const router = useRouter();

    return (
      <Card className=" pt-5 px-5 pb-4  border border-content2">
        <CardHeader className=" flex-col max-w-60">
  
        <h1 className=" text-xl font-medium">Inicia sesión</h1>
        <p className="text-small text-default-500 text-center leading-4 mt-3">
            Inicia sesión con una cuenta autorizada
        </p>
        </CardHeader>
  
          <Link className=" w-full flex-1 flex-shrink-0 flex-grow-0 flex" href={LOGIN}>
            <Button color="primary" className=" w-full" onPress={
              () => {
                router.push(LOGIN)
              }
            }>
              Login
            </Button>
          </Link>
  
      </Card>
    )
  }