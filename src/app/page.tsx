import { auth } from "@/auth";
import { LOGIN } from "@/lib/routes";
import { Button, Card, CardBody, CardHeader, Divider } from "@heroui/react";
import Link from "next/link";
import { doLogout } from "./actions";
import Image from "next/image";
import { CircleAlert } from "lucide-react";
import { ROLES } from "@/lib/constants";

const LoggedScreen = async (session) => {

  const isAdmin = session?.user?.role === ROLES.ADMIN

  return (
    <>
    
    <div className=" bg-content1 max-w-80 w-full rounded-2xl mx-auto p-5 flex flex-col gap-5" >

      <div className=" w-full flex justify-center items-center ">
      <Image src={session?.user?.image} height={100} width={100} alt="user image" className=" rounded-2xl" />
      </div>


      <div>
      <h1 className=" text-center text-xl font-medium px-5 ">Hola {session?.user?.name}!</h1>
      <p className="text-small text-default-500 text-center my-2">
        Ya has iniciado sesión
      </p>
      </div>

      <div className=" flex gap-2 ">
      <form action={doLogout} className=" w-full ">
        <Button  className=" w-full" variant="flat" color="danger" type="submit">Logout</Button>
      </form>
      
      {
        isAdmin && (
          <Link className=" w-full" href="/admin">
            <Button  className=" w-full" color="primary" type="submit">
              Menu
            </Button>
          </Link>
        )
      }

      
      </div>
    
    </div>

      {
        !isAdmin && (
          <div className=" bg-danger-500/20 max-w-80 rounded-2xl w-full mx-auto  p-3 flex justify-center items-center text-danger-400 gap-2">
          <CircleAlert />
          <p className=" text-center ">
            No estas autorizado 
          </p>
        </div>
        )
      }

    </>
    
  )
}

const NotLoggedScreen = () => {
  return (
    <Card className=" pt-5 px-5 pb-4  border border-content2">
      <CardHeader className=" flex-col max-w-60">

      <h1 className=" text-xl font-medium">Inicia sesión</h1>
      <p className="text-small text-default-500 text-center leading-4 mt-3">
          Inicia sesión con una cuenta autorizada
      </p>
      </CardHeader>

      <CardBody>
        <Link className=" w-full flex-1 flex-shrink-0 flex-grow-0 flex" href={LOGIN}>
          <Button color="primary" className=" w-full">
            Login
          </Button>
        </Link>
      </CardBody>
    </Card>
  )
}

export default async function Home() {
  const session = await auth();
  return (
    <>
    <div className=" min-h-dvh  flex flex-col justify-center items-center gap-4">
        {session?.user ? LoggedScreen(session) : NotLoggedScreen()}
    </div>
    </>
  )
}