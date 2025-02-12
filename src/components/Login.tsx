"use client";
import {Button} from "@heroui/react";
import {Icon} from "@iconify/react";
import { useSearchParams } from "next/navigation";
import { doSocialLogin } from "@/app/actions";


export const LoginPage = function Component() {

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const handleAction = async (e) => {
    const action = e.get('action');
    if (!action) {
      console.error('No action selected');
      return;
    }
    try {
      await doSocialLogin(action, callbackUrl || '/');
    } catch (error) {
      console.error('Error during social login:', error);
    }
  };

  

  return (
    <div className="flex h-full w-full items-center justify-center my-auto min-h-dvh ">
      <div className="flex w-full max-w-72 flex-col rounded-large bg-content1 border border-content2 p-8 gap-6 ">
        <div className="flex flex-col items-center">
          <p className="text-xl font-medium">Bienvenido</p>
          <p className="text-small text-default-500">
            Inicia sesión para continuar
          </p>
        </div>

        <form 
            action={handleAction}
            className="flex flex-col gap-2"
            >
          <Button
            startContent={<Icon icon="flat-color-icons:google" width={24} />}
            variant="bordered"
            type="submit"
            name="action"
            value={'google'}
          >
            Continuar con Google
          </Button>
        </form>

      </div>
    </div>
  );
}
