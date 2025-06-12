import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
import { Contacto } from '../../models/contacto';

@Component({
  selector: 'app-panel-contacto',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './panel-contacto.component.html',
  styleUrls: ['./panel-contacto.component.css']
})
export class PanelContactoComponent implements OnInit {
  @Output() cerrar = new EventEmitter<void>();
  contactos: Contacto[] = [];

  ngOnInit(): void {
    const data = localStorage.getItem('contactos');
    this.contactos = data ? JSON.parse(data) : [];
  }

  eliminarContacto(index: number) {
    Swal.fire({
      title: '¿Eliminar esta solicitud?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.contactos.splice(index, 1);
        localStorage.setItem('contactos', JSON.stringify(this.contactos));
        Swal.fire('Eliminado', 'La solicitud fue eliminada.', 'success');
      }
    });
  }

  cerrarPanel() {
    this.cerrar.emit();
  }
}
