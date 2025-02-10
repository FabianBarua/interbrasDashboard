
'use server'

import { signIn, signOut } from "@/auth";

export async function doSocialLogin(formData: { get: (arg0: string) => any; }, redirect: string | undefined) {
    const action = formData.get('action');
    await signIn(action, { redirectTo: redirect || "/" });
}

export async function doLogout() {
  await signOut({ redirectTo: "/" });
}