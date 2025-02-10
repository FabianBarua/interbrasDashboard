import { DefaultSession } from "next-auth";

type Role = 'user' | 'admin';

export type ExtendedUser = DefaultSession["user"] & { role: Role };

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }

  interface AdapterUser extends ExtendedUser {
    role: Role;
  }

  interface User extends ExtendedUser {
    role: Role;
  }

}
