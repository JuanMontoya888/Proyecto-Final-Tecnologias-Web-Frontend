export interface Reservacion {
  nombre: string;
  tipoHabitacion: 'Individual' | 'Doble' | 'Suite' | 'Familiar';
  serviciosSeleccionados: string[];
  metodoPago: 'Tarjeta' | 'Efectivo';
  fechaInicio: string; 
  fechaFin: string;    
  hotel: string;
  precioBase: number;
  precioServicios: number;
  precioTotal: number;
}
