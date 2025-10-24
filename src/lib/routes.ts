
export const LOGIN = '/login';
export const ROOT = '/';

export const PUBLIC_ROUTES = [
    '/login',
    '/register',
    '/products',
    '/api/auth/callback/google',
    '/api/auth/callback/github',
    '/api/catalog/latest',
    '/api/catalog/test'
]

export const PROTECTED_SUB_ROUTES = [
    '/checkout',
]