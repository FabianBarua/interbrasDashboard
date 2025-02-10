"use client";

import { doSocialLogin } from "@/app/actions";
import { useSearchParams } from "next/navigation";

const LoginForm = () => {

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    return (
        <form action={
            (e)=>{
                doSocialLogin(e, callbackUrl);
            }
        }>
            <button className="bg-pink-400 text-white p-1 rounded-md m-1 text-lg" type="submit" name="action" value="google">
                Sign In With Google
            </button>

            <button className="bg-black text-white p-1 rounded-md m-1 text-lg" type="submit" name="action" value="github">
                Sign In With GitHub
            </button>
        </form>
    );
};

export default LoginForm;
