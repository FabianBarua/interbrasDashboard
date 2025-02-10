'use client';
import { doSocialLogin } from "@/app/actions";
import { useSearchParams } from "next/navigation";

const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const handleAction = async (e) => {
    const action = e.get('action');
    if (!action) {
      console.error('No action selected');
      return;
    }
    try {
      await doSocialLogin(action, callbackUrl);
    } catch (error) {
      console.error('Error during social login:', error);
    }
  };

  return (
    <form action={handleAction}>
      <button
        className="bg-pink-400 text-white p-1 rounded-md m-1 text-lg"
        type="submit"
        name="action"
        value="google"
      >
        Sign In With Google
      </button>

      <button
        className="bg-black text-white p-1 rounded-md m-1 text-lg"
        type="submit"
        name="action"
        value="github"
      >
        Sign In With GitHub
      </button>
    </form>
  );
};

export default LoginForm;
