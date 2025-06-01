import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HotelService } from '../../services/hotel.service';
import { Hotel } from '../../models/hotel';
import { Reservacion } from '../../models/reservacion';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { ReservasService } from '../../services/reservas.service';


import Swal from 'sweetalert2';
import { ValidatorsReserv } from './validators';

function nombreCompletoValidator(control: FormControl) {
  const valor = control.value || '';
  const palabras = valor.trim().split(/\s+/);
  return palabras.length >= 2 ? null : { nombreCompleto: true };
}

function rangoFechaValidator(min: Date, max: Date) {
  return (group: FormGroup) => {
    const inicio = group.get('fechaInicio')?.value;
    const fin = group.get('fechaFin')?.value;

    if (!inicio || !fin) return null;

    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(fin);

    if (fechaInicio < min) {
      return { fechaInvalida: 'La fecha de inicio debe ser al menos con 15 días de anticipación.' };
    }

    if (fechaFin > max) {
      return { fechaInvalida: 'La fecha de fin no puede exceder 6 meses desde hoy.' };
    }

    if (fechaFin < fechaInicio) {
      return { fechaInvalida: 'La fecha final no puede ser anterior a la inicial.' };
    }

    return null;
  };
}

@Component({
  selector: 'app-reservacion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './reservacion.component.html',
  styleUrls: ['./reservacion.component.css']
})
export class ReservacionComponent implements OnInit {
  hotel!: Hotel;
  reservacionForm!: FormGroup;
  precioServicios = 0;
  precioTotal = 0;
  precioBase = 0;
  minDate: Date = new Date();
  maxDate: Date = new Date();
  tiposHabitacion: string[] = ['Individual', 'Doble', 'Suite', 'Familiar'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: HotelService,
    private reservas : ReservasService
  ) {}

  ngOnInit(): void {
    this.minDate.setDate(this.minDate.getDate() + 15);
    this.maxDate.setMonth(this.maxDate.getMonth() + 6);

    const id = this.route.snapshot.paramMap.get('id');
    this.hotelService.obtenerHoteles().subscribe(hoteles => {
      const encontrado = hoteles.find(h => h.id === id);
      if (encontrado) {
        this.hotel = encontrado;
        this.inicializarFormulario();
      }
    });
  }

  inicializarFormulario() {
    this.reservacionForm = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.minLength(3),
        ValidatorsReserv.nombreCompletoValidator()
      ]],
      tipoHabitacion: ['', Validators.required],
      serviciosSeleccionados: this.fb.group({}),
      metodoPago: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required]
    }, {
      validators: ValidatorsReserv.rangoFechaValidator(this.minDate, this.maxDate)
    });
    

    this.hotel.servicios.forEach(servicio => {
      const control = new FormControl(false);
      (this.reservacionForm.get('serviciosSeleccionados') as FormGroup).addControl(servicio, control);
    });

    this.reservacionForm.get('fechaInicio')?.valueChanges.subscribe(() => this.calcularTotal());
    this.reservacionForm.get('fechaFin')?.valueChanges.subscribe(() => this.calcularTotal());

    this.calcularTotal();
  }

  calcularTotal() {
    if (!this.hotel || !this.hotel.precio || !this.hotel.precioServicio || !this.reservacionForm) {
      this.precioServicios = 0;
      this.precioTotal = 0;
      return;
    }

    const seleccionados = this.obtenerServiciosSeleccionados();
    this.precioServicios = seleccionados.length * this.hotel.precioServicio;

    const fechaInicio = new Date(this.reservacionForm.get('fechaInicio')?.value);
    const fechaFin = new Date(this.reservacionForm.get('fechaFin')?.value);

    let dias = 1;
    if (fechaInicio && fechaFin && fechaFin >= fechaInicio) {
      const diff = fechaFin.getTime() - fechaInicio.getTime();
      dias = Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;
    }

    this.precioBase = dias * this.hotel.precio;
    this.precioTotal = this.precioBase + this.precioServicios;
  }

  obtenerServiciosSeleccionados(): string[] {
    const grupo = this.reservacionForm.get('serviciosSeleccionados')?.value;
    return Object.keys(grupo).filter(key => grupo[key]);
  }

  enviar() {
  if (this.reservacionForm.valid) {
    Swal.fire({
      title: '¿Confirmar reservación?',
      text: 'Verifica que los datos sean correctos antes de guardar.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, reservar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        const datos = this.reservacionForm.value;

        const nuevaReservacion: Reservacion = {
          nombre: datos.nombre,
          tipoHabitacion: datos.tipoHabitacion,
          serviciosSeleccionados: this.obtenerServiciosSeleccionados(),
          metodoPago: datos.metodoPago,
          fechaInicio: datos.fechaInicio.toISOString(), // Convierte fechas a formato ISO
          fechaFin: datos.fechaFin.toISOString(),
          hotel: this.hotel.nombre,
          precioBase: this.precioBase,
          precioServicios: this.precioServicios,
          precioTotal: this.precioTotal
        };

        this.reservas.createPost(nuevaReservacion).subscribe({
          next: (res: any) => {
            Swal.fire('¡Reservación completada!', 'Gracias por tu preferencia.', 'success').then(() => {
              this.reservacionForm.reset();
              this.precioServicios = 0;
              this.precioBase = 0;
              this.precioTotal = 0;
              this.router.navigate(['/hoteles']);
            });
          },
          error: (error) => {
            console.error('Error al guardar la reservación:', error);
            Swal.fire('Error', 'No se pudo guardar la reservación. Intenta de nuevo.', 'error');
          }
        });
      }
    });
  } else {
    Swal.fire('Error', 'Por favor completa todos los campos correctamente.', 'error');
  }
}
}
