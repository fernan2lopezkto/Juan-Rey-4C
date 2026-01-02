// utilities/libretadenotas/types.ts
export interface Song {
  id: string;
  title: string;
  chords: string; // Ej: "C G Am F"
  notes?: string;
}
