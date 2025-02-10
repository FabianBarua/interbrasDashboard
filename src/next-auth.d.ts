import { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: 'user' | 'admin';
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
