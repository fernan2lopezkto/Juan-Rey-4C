// components/libretaDeNotas/TagManager.tsx
'use client';
import { useState } from 'react';

interface TagManagerProps {
  tags: string[];
  onChange: (newTags: string[]) => void;
}

export default function TagManager({ tags, onChange }: TagManagerProps) {
  const [inputValue, setInputValue] = useState('');

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(t => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
          placeholder="Ej: Domingo mañana, Lentas..."
          className="input input-bordered input-sm flex-1"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button 
          type="button" 
          onClick={addTag} 
          className="btn btn-sm btn-primary"
        >
          Añadir
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.length === 0 && (
          <span className="text-xs opacity-30 italic">Sin etiquetas todavía...</span>
        )}
        {tags.map((tag) => (
          <div key={tag} className="badge badge-primary gap-1 py-3 pr-1 pl-3 shadow-sm">
            <span className="text-xs font-bold">{tag}</span>
            <button 
              type="button" 
              onClick={() => removeTag(tag)}
              className="btn btn-ghost btn-xs btn-circle hover:bg-primary-focus"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
