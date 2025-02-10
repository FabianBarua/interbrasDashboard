import { auth } from "@/auth";
import Logout from "@/components/Logout";
import { LOGIN } from "@/lib/routes";
import Image from "next/image";
import Link from "next/link";

const LoggedScreen = async (session) => {
  return (
    <div>
      <h1>Welcome, {session?.user?.name}</h1>
      <p>You are logged in!</p>
      <pre>
          <code>{JSON.stringify(session, null, 2)}</code>
      </pre>
      <Image
          src={session?.user?.image}
          alt={session?.user?.name}
          width={72}
          height={72}
          className="rounded-full"
      />
      <Logout />
    </div>
  )
}

const NotLoggedScreen = () => {
  return (
    <div>
      <h1>Inicia session</h1>
      <Link href={LOGIN}>
          Sign In
      </Link>
    </div>
  )
}

export default async function Home() {
  const session = await auth();
  return (
    <>
        {session?.user ? LoggedScreen(session) : NotLoggedScreen()}
    </>
  )
}
