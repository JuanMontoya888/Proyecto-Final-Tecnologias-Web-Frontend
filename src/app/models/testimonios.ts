export interface Testimonio {
    nombre: string;
    comentario: string;
    estrellas: number;
  }
  
  export const TESTIMONIOS_PREDETERMINADOS: Testimonio[] = [
    { nombre: 'lucía r.', comentario: 'una experiencia inolvidable.', estrellas: 5 },
    { nombre: 'carlos m.', comentario: 'muy cómodo y limpio.', estrellas: 4 },
    { nombre: 'ana p.', comentario: 'ideal para descansar.', estrellas: 5 }
  ];