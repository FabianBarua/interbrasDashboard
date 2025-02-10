import { auth } from "@/auth";
import Logout from "@/components/Logout";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  return (
    <div className="flex flex-col justify-center items-center m-4">
        {session?.user ? (
          <div>
            <h1 className="text-3xl my-2">Welcome, {session?.user?.name}</h1>
            <p className="text-lg my-2">You are logged in!</p>
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
        ) : 
        <div>
          <h1 className="text-3xl my-3">Hey, time to Sign In</h1>
          <Link href="/login">
              Sign In
          </Link>
        </div>
        }

    </div>
  )
}
