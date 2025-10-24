import {PUBLIC_ROUTES, LOGIN, ROOT, PROTECTED_SUB_ROUTES} from "@/lib/routes";
import { auth } from "@/auth";

// Rutas que requieren rol de admin
const ADMIN_ROUTES = [
  '/admin',
  '/dashboard',
  // Agrega aquí las rutas que requieren admin
];

export async function middleware(request) {
  const { nextUrl } = request;

  console.log('test')

  const session = await auth();

  const isAuthenticated = !!session?.user;

  const isPublicRoute = ((PUBLIC_ROUTES.find(route => nextUrl.pathname.startsWith(route))
  || nextUrl.pathname === ROOT) && !PROTECTED_SUB_ROUTES.find(route => nextUrl.pathname.includes(route)));

  // Verificar si la ruta requiere admin
  const isAdminRoute = ADMIN_ROUTES.some(route => nextUrl.pathname.startsWith(route));

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

  // Verificar permisos de admin
  if (isAuthenticated && isAdminRoute && session?.user?.role !== 'admin') {
    // Redirigir a página de acceso denegado o home
    return Response.redirect(new URL('/', nextUrl));
  }
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)", '/api/catalog/:path*']
};
