import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Contacto } from '../../models/contacto';
import { Router } from '@angular/router';

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

  constructor(private router: Router) { }

  enviar(formulario: any) {
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
          // Recuperar solicitudes anteriores, si existen
          const contactosGuardados = localStorage.getItem('contactos');
          const contactos: Contacto[] = contactosGuardados ? JSON.parse(contactosGuardados) : [];


          contactos.push({ ...this.contacto });

          // Guardar el nuevo array actualizado
          localStorage.setItem('contactos', JSON.stringify(contactos));

          Swal.fire('¡Solicitud enviada!', 'Te contactaremos pronto.', 'success');

          formulario.reset();
        }
      });
    } else {
      Swal.fire('Error', 'Por favor llena todos los campos correctamente.', 'error');
    }
  }
}
