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
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-testimonios',
  imports: [CommonModule, CapitalizarPipe, EstrellasPipe, OracionPipe, FormsModule],
  templateUrl: './testimonios.component.html',
  styleUrl: './testimonios.component.css'
})
export class TestimoniosComponent {
  testimonios: Testimonio[] = [];
  nuevo: Testimonio = { nombre: '', comentario: '', estrellas: 5 };

  constructor(private router: Router, private adminService: AdminService) { }

  ngOnInit() {
    this.adminService.getComentarios()
      .subscribe(async (res) => {
        const { ok } = res;

        if (ok) {
          const { data } = res;
          this.testimonios = data;
        }
      });
  }

  agregarTestimonio() {
    const userLogueado = localStorage.getItem('userLogueado');
    if (!userLogueado) {
      Swal.fire({
        title: 'No autorizado',
        text: 'Debes iniciar sesión para agregar un testimonio. ¿Deseas iniciar sesión ahora?',
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

      this.adminService.addComentario(this.nuevo)
        .subscribe((res) => {
          const { ok } = res;

          if (ok) {
            Swal.fire({
              title: '¡Comentario recibido!',
              text: 'Gracias por compartir tu opinión. Ha sido agregado exitosamente.',
              icon: 'success',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#3085d6',
              backdrop: true,
              timer: 3000,
              timerProgressBar: true,
              showClass: {
                popup: 'swal2-show animate__animated animate__fadeInDown'
              },
              hideClass: {
                popup: 'swal2-hide animate__animated animate__fadeOutUp'
              }
            });
          } else {
            Swal.fire({
              title: 'Error al enviar',
              text: 'Ocurrió un problema al intentar agregar tu comentario. Intenta nuevamente.',
              icon: 'error',
              confirmButtonText: 'Reintentar',
              confirmButtonColor: '#d33',
              backdrop: true,
              showClass: {
                popup: 'swal2-show animate__animated animate__shakeX'
              },
              hideClass: {
                popup: 'swal2-hide animate__animated animate__fadeOut'
              }
            });
          }

        });


      this.nuevo = { nombre: '', comentario: '', estrellas: 5 };
    }
  }
}
