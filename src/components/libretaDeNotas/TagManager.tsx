'use client';
import { useState } from 'react';

interface TagManagerProps {
  tags: string[];
  onChange: (newTags: string[]) => void;
}

export default function TagManager({ tags, onChange }: TagManagerProps) {
  const [inputValue, setInputValue] = useState('');

  const addTag = () => {
    // Normalizamos: quitamos espacios y evitamos vacíos
    const trimmed = inputValue.trim();
    
    // Solo añadimos si hay texto y si no existe ya en la lista
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      setInputValue('');
    } else {
      // Si ya existe, simplemente limpiamos el input para no confundir
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(t => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Permitimos añadir etiquetas con la tecla Enter
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="form-control w-full">
      <label className="label text-xs uppercase font-bold opacity-40 tracking-widest">
        Etiquetas / Grupos
      </label>
      
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Ej: Domingo, Lentas, Adoración..."
          className="input input-bordered input-sm flex-1 focus:border-primary"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button 
          type="button" 
          onClick={addTag} 
          className="btn btn-sm btn-primary shadow-sm"
        >
          Añadir
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.length === 0 ? (
          <span className="text-xs opacity-30 italic px-1">Sin etiquetas todavía...</span>
        ) : (
          tags.map((tag) => (
            <div 
              key={tag} 
              className="badge badge-primary badge-outline gap-1 py-3 pr-1 pl-3 shadow-sm hover:bg-primary hover:text-primary-content transition-colors"
            >
              <span className="text-[10px] font-black uppercase tracking-tight">{tag}</span>
              <button 
                type="button" 
                onClick={() => removeTag(tag)}
                className="btn btn-ghost btn-xs btn-circle hover:bg-error hover:text-white"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
