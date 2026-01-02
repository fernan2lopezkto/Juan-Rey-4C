'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function MenuFlotante() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Opciones desplegables */}
      {open && (
        <ul className="menu bg-base-200 w-56 rounded-box shadow-xl border border-base-300 mb-2 animate-fade-in-up">
          <li><Link href="/utilities/libretadenotas/agregarcancion" onClick={() => setOpen(false)}>➕ Nueva Canción</Link></li>
          <li><Link href="/utilities/libretadenotas/listadecanciones" onClick={() => setOpen(false)}>📋 Ver Lista</Link></li>
        </ul>
      )}

      {/* Botón Principal (Toggle) */}
      <button 
        className={`btn btn-circle btn-primary btn-lg shadow-lg transition-transform ${open ? 'rotate-45' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <span className="text-3xl">+</span>
      </button>
    </div>
  );
}
