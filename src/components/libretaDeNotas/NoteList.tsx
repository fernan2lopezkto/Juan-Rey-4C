'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSongs, Song } from '@/components/libretaDeNotas/storage';

export default function ListaCanciones() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => { setSongs(getSongs()); }, []);

  const filtered = songs.filter(s => s.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-2xl mx-auto">
      <input
        type="search"
        placeholder="Buscar canción..."
        className="input input-bordered w-full mb-6"
        onChange={(e) => setSearch(e.target.value)}
      />
      
      <div className="flex flex-col gap-3">
        {filtered.map((song) => (
          <Link key={song.id} href={`/utilities/libretadenotas/cancion/${song.id}`}>
            <div className="card bg-base-100 border border-base-300 hover:bg-base-200 transition-colors cursor-pointer">
              <div className="card-body p-4 flex-row justify-between items-center">
                <h3 className="font-bold text-lg">{song.title}</h3>
                <span className="badge badge-ghost font-mono">{song.chords.slice(0, 15)}...</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
