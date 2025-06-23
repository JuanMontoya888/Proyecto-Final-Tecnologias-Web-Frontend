import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Testimonio } from '../../models/testimonios';
import { TESTIMONIOS_PREDETERMINADOS } from '../../models/testimonios';
import { CapitalizarPipe } from '../../pipes/capitalizar.pipe';
import { EstrellasPipe } from '../../pipes/estrellas.pipe';
import { FormsModule } from '@angular/forms';
import { OracionPipe } from '../../pipes/oracion.pipe';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { LectorVozDirective } from '../../directives/lector-voz.directive';

@Component({
  selector: 'app-testimonios',
  imports: [CommonModule, CapitalizarPipe, EstrellasPipe, OracionPipe, FormsModule, LectorVozDirective],
  templateUrl: './testimonios.component.html',
  styleUrl: './testimonios.component.css'
})
export class TestimoniosComponent {
  testimonios: Testimonio[] = [];
  nuevo: Testimonio = { nombre: '', comentario: '', estrellas: 5 };

  constructor(private router: Router) { }

  ngOnInit() {
    const guardados = localStorage.getItem('testimonios');
    this.testimonios = guardados ? JSON.parse(guardados) : [...TESTIMONIOS_PREDETERMINADOS];
  }

  agregarTestimonio() {
    const userLogueado = localStorage.getItem('userLogueado');
    if (!userLogueado) {
      Swal.fire({
        title: 'No autorizado',
        text: 'Debes iniciar sesión para hacer una reservación. ¿Deseas iniciar sesión ahora?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Iniciar sesión',
        cancelButtonText: 'Cancelar'
      }).then(result => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
      return;
    }

    if (this.nuevo.nombre && this.nuevo.comentario) {
      this.testimonios.push({ ...this.nuevo });
      localStorage.setItem('testimonios', JSON.stringify(this.testimonios));
      this.nuevo = { nombre: '', comentario: '', estrellas: 5 };
    }
  }
}
