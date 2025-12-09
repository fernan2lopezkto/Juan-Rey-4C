"use client";

import Link from 'next/link';
import ThemeSwitcher from './ThemeSwitcher'; // Importamos el selector de tema
import { signIn, useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    // 'navbar' y 'bg-base-100' son clases de DaisyUI
    <div className="navbar bg-base-100 shadow-md">
      <div className="flex-1">
        {/* Usamos 'Link' de Next.js para la navegación rápida */}
        <Link href="/" className="btn btn-ghost text-xl normal-case">
          Juan Rey 4C
        </Link>
      </div>
      <div className="flex-none gap-2">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/youtube-filter">YoutubeFilter</Link>
          </li>
        </ul>

        {/* Componente para cambiar entre modo claro y oscuro */}
        <ThemeSwitcher />

        {/* Mostrar información del usuario si está autenticado */}
        {session?.user && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-base-content">{session.user.name}</span>
          </div>
        )}

        {/* Botón de Login/Logout condicional */}
        {session ? (
          <button className="btn btn-secondary ml-4" onClick={() => signOut()}>
            Cerrar Sesión
          </button>
        ) : (
          <button className="btn btn-primary ml-4" onClick={() => signIn()}>
            Iniciar Sesión
          </button>
        )}
      </div>
    </div>
  );
}