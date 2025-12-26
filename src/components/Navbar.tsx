"use client";

import Link from 'next/link';
import ThemeSwitcher from './ThemeSwitcher';
import { signIn, useSession, signOut } from "next-auth/react";
import { useState } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Filtro', href: '/youtube-filter' },
    { name: 'About', href: '/about' },
    { name: 'Utilidades', href: '/utilities' },
  ];

  const menuItems = (
    <>
      {navLinks.map((link) => (
        <li key={link.href}>
          <Link href={link.href} onClick={closeMenu} className="text-2xl lg:text-base">
            {link.name}
          </Link>
        </li>
      ))}
    </>
  );

  return (
    <div className="navbar bg-base-100 border-b border-base-200 sticky top-0 z-50">
      <div className="navbar-start">
        {/* Botón Hamburguesa para Móvil */}
        <button
          onClick={toggleMenu}
          className="btn btn-ghost lg:hidden"
          aria-label="Abrir menú"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Link href="/" className="btn btn-ghost text-xl normal-case">
          Juan Rey 4C
        </Link>
      </div>

      {/* Menú Desktop */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {menuItems}
        </ul>
      </div>

      <div className="navbar-end gap-2">
        <ThemeSwitcher />

        {session?.user && (
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm text-base-content font-medium">{session.user.name}</span>
            {session.user.image && (
              <img src={session.user.image} alt={session.user.name || "User"} className="w-8 h-8 rounded-full" />
            )}
          </div>
        )}

        {session ? (
          <button className="btn btn-sm btn-secondary ml-2" onClick={() => signOut()}>
            Sign Out
          </button>
        ) : (
          <button className="btn btn-sm ml-2" onClick={() => signIn()}>
            Sign In
          </button>
        )}
      </div>

      {/* OVERLAY DE MENÚ MÓVIL (PANTALLA COMPLETA) */}
      <div className={`fixed inset-0 z-[100] bg-base-100 transition-transform duration-300 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:hidden`}>
        <div className="flex flex-col h-full p-6">
          {/* Botón Cerrar */}
          <div className="flex justify-end">
            <button onClick={closeMenu} className="btn btn-ghost btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Enlaces del menú centrados */}
          <div className="flex flex-col items-center justify-center flex-grow">
            <ul className="menu menu-vertical items-center gap-6">
              {menuItems}
              {session?.user && (
                <li className="mt-4 flex flex-col items-center gap-2">
                  <img src={session.user.image || ""} alt="User" className="w-16 h-16 rounded-full border-2 border-primary" />
                  <span className="text-xl font-bold">{session.user.name}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
