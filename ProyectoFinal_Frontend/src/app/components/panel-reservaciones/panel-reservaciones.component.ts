import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { Reservacion } from '../../models/reservacion';
import { ValidatorsReserv } from '../reservacion/validators';
import { HotelService } from '../../services/hotel.service';
import Swal from 'sweetalert2';
import { ReservasService } from '../../services/reservas.service';
import { AdminService } from '../../services/admin.service';

type ReservacionConId = Reservacion & { id: string };

@Component({
  selector: 'app-panel-reservaciones',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './panel-reservaciones.component.html',
  styleUrls: ['./panel-reservaciones.component.css']
})
export class PanelReservacionesComponent implements OnInit {
  @Output() cerrar = new EventEmitter<void>();
  reservaciones: ReservacionConId[] = [];
  editandoIndex: number | null = null;
  reservacionForm!: FormGroup;
  hotelEditando!: any;
  precioBase = 0;
  precioServicios = 0;
  precioTotal = 0;
  minDate: Date = new Date();
  maxDate: Date = new Date();
  tiposHabitacion: string[] = ['Individual', 'Doble', 'Suite', 'Familiar'];

  constructor(
    private fb: FormBuilder,
    private hotelService: HotelService,
    private reservasService: ReservasService
  ) { }

  ngOnInit(): void {
    this.minDate.setDate(this.minDate.getDate() + 15);
    this.maxDate.setMonth(this.maxDate.getMonth() + 6);

    this.reservasService.obtenerReservas().subscribe({
      next: (data) => {
        this.reservaciones = data;
        console.log('Reservas obtenidas:', data);
      },
      error: (error) => {
        console.error('Error al obtener las reservas:', error);
      }
    });
  }

  eliminarReservacion(index: number) {
    const id = this.reservaciones[index].id;
    Swal.fire({
      title: '¿Eliminar reservación?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.reservasService.eliminarReserva(id).subscribe({
          next: () => {
            this.reservaciones.splice(index, 1);
            Swal.fire('Eliminado', 'La reservación fue eliminada.', 'success');
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar la reservación.', 'error');
          }
        });
      }
    });
  }

  editarReservacion(index: number) {
    const r = this.reservaciones[index];
    this.editandoIndex = index;
    this.precioBase = r.precioBase;
    this.precioServicios = r.precioServicios;
    this.precioTotal = r.precioTotal;

    this.hotelService.obtenerHoteles().subscribe(hoteles => {
      this.hotelEditando = hoteles.find(h => h.nombre === r.hotel);
      if (this.hotelEditando) {
        this.inicializarFormulario(r);
      }
    });
  }

  inicializarFormulario(r: Reservacion) {
    this.reservacionForm = this.fb.group({
      nombre: [r.nombre, [Validators.required, Validators.minLength(3), ValidatorsReserv.nombreCompletoValidator()]],
      tipoHabitacion: [r.tipoHabitacion, Validators.required],
      serviciosSeleccionados: this.fb.group({}),
      metodoPago: [r.metodoPago, Validators.required],
      fechaInicio: [r.fechaInicio, Validators.required],
      fechaFin: [r.fechaFin, Validators.required]
    }, { validators: ValidatorsReserv.rangoFechaValidator(this.minDate, this.maxDate) });

    this.hotelEditando.servicios.forEach((s: string) => {
      const activo = r.serviciosSeleccionados.includes(s);
      (this.reservacionForm.get('serviciosSeleccionados') as FormGroup).addControl(s, new FormControl(activo));
    });

    this.reservacionForm.get('fechaInicio')?.valueChanges.subscribe(() => this.calcularTotal());
    this.reservacionForm.get('fechaFin')?.valueChanges.subscribe(() => this.calcularTotal());
  }

  calcularTotal() {
    const seleccionados = this.obtenerServiciosSeleccionados();
    this.precioServicios = seleccionados.length * this.hotelEditando.precioServicio;

    const fechaInicio = new Date(this.reservacionForm.get('fechaInicio')?.value);
    const fechaFin = new Date(this.reservacionForm.get('fechaFin')?.value);
    let dias = 1;
    if (fechaInicio && fechaFin && fechaFin >= fechaInicio) {
      const diff = fechaFin.getTime() - fechaInicio.getTime();
      dias = Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;
    }

    this.precioBase = dias * this.hotelEditando.precio;
    this.precioTotal = this.precioBase + this.precioServicios;
  }

  obtenerServiciosSeleccionados(): string[] {
    const grupo = this.reservacionForm.get('serviciosSeleccionados')?.value;
    return Object.keys(grupo).filter(key => grupo[key]);
  }

  guardarCambios() {
    if (this.reservacionForm.valid && this.editandoIndex !== null) {
      const datos = this.reservacionForm.value;
      const reservacionActualizada: Reservacion = {
        nombre: datos.nombre,
        tipoHabitacion: datos.tipoHabitacion,
        serviciosSeleccionados: this.obtenerServiciosSeleccionados(),
        metodoPago: datos.metodoPago,
        fechaInicio: datos.fechaInicio,
        fechaFin: datos.fechaFin,
        hotel: this.hotelEditando.nombre,
        precioBase: this.precioBase,
        precioServicios: this.precioServicios,
        precioTotal: this.precioTotal
      };

      const id = this.reservaciones[this.editandoIndex].id;
      console.log('ID a actualizar:', id);
      console.log('Datos:', reservacionActualizada);


      this.reservasService.actualizarReserva(id, reservacionActualizada).subscribe({
        next: () => {
          this.reservaciones[this.editandoIndex!] = { ...reservacionActualizada, id };
          Swal.fire('¡Actualizado!', 'La reservación fue modificada.', 'success');
          this.editandoIndex = null;
        },
        error: (error) => {
          console.error('Error al actualizar:', error);
          Swal.fire('Error', 'No se pudo actualizar la reservación.', 'error');
        }
      });
    }
  }

  cancelarEdicion() {
    this.editandoIndex = null;
  }

  cerrarPanel() {
    this.cerrar.emit();
  }
}
