
'use server'

import { signIn, signOut } from "@/auth";

export async function doSocialLogin(action: string, redirect?: string) {
    await signIn(action, { redirectTo: redirect || "/" });
}

export async function doLogout() {
  await signOut({ redirectTo: "/" });
}