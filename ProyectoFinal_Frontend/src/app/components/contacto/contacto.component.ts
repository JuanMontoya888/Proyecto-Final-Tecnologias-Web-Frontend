import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Contacto } from '../../models/contacto';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {
  contacto: Contacto = {
    nombre: '',
    email: '',
    celular: '',
    asunto: '',
    mensaje: ''
  };

  constructor(private router: Router, private adminService: AdminService) { }

  enviar(formulario: any) {
    const userLogueado = localStorage.getItem('userLogueado');
    if (!userLogueado) {
      Swal.fire({
        title: 'No autorizado',
        text: 'Debes iniciar sesión para enviar un comentario. ¿Deseas iniciar sesión ahora?',
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

    if (formulario.valid) {
      Swal.fire({
        title: '¿Enviar solicitud?',
        text: 'Verifica que los datos sean correctos antes de enviar.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, enviar',
        cancelButtonText: 'Cancelar'
      }).then(result => {
        if (result.isConfirmed) {
          this.adminService.addContacto(this.contacto).subscribe((res) => {
            const { ok } = res;

            if (ok) {
              Swal.fire({
                title: '¡Solicitud enviada!',
                text: 'Gracias por tu interés. Nos pondremos en contacto contigo lo antes posible.',
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
                title: 'Error',
                text: 'No se pudo enviar tu solicitud. Inténtalo nuevamente más tarde.',
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



          formulario.reset();
        }
      });
    } else {
      Swal.fire('Error', 'Por favor llena todos los campos correctamente.', 'error');
    }
  }
}
