export { default } from "next-auth/middleware";

export const config = {
  // Aquí defines qué rutas quieres proteger. 
  // Si un usuario no está logueado e intenta entrar aquí, será enviado al /login.
  matcher: [
    "/profile/:path*", 
    // Puedes agregar más rutas aquí, por ejemplo:
    // "/dashboard/:path*",
  ],
};
