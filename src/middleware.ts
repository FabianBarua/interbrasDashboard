import {PUBLIC_ROUTES, LOGIN, ROOT, PROTECTED_SUB_ROUTES} from "@/lib/routes";
import { auth } from "@/auth";

export async function middleware(request) {
  const { nextUrl } = request;

  console.log('test')

  const session = await auth();

  const isAuthenticated = !!session?.user;

  const isPublicRoute = ((PUBLIC_ROUTES.find(route => nextUrl.pathname.startsWith(route))
  || nextUrl.pathname === ROOT) && !PROTECTED_SUB_ROUTES.find(route => nextUrl.pathname.includes(route)));

  if (!isAuthenticated && !isPublicRoute){
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return Response.redirect(
      new URL(`${LOGIN}?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)", '/api/catalog/:path*']
};
