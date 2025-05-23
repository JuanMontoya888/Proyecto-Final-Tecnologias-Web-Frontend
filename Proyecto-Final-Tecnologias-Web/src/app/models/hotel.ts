export interface Hotel {
  id: string;
  nombre: string;
  ciudad: string;
  categoria: number;
  tipoHotel: 'Económico' | 'De lujo' | 'Boutique' | 'Resort';
  precio: number;
  disponibilidad: boolean;
  servicios: string[];
  precioServicio: number;
  descripcion: string;
  imagen: string; 
}
