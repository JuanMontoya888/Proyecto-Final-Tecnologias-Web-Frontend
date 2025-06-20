import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
import { Contacto } from '../../models/contacto';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-panel-contacto',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './panel-contacto.component.html',
  styleUrls: ['./panel-contacto.component.css']
})
export class PanelContactoComponent implements OnInit {
  @Output() cerrar = new EventEmitter<void>();
  contactos: any = [];

  constructor(private adminService: AdminService) { }


  ngOnInit(): void {
    this.getData();
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
        this.adminService.deleteContactosByID(this.contactos[index].id)
          .subscribe((res) => {
            const { ok } = res;

            if (ok) {
              Swal.fire('Eliminado', 'La solicitud fue eliminada.', 'success');
              this.getData();
            }
          });

      }
    });
  }

  getData(): void {
    this.adminService.getContactos().subscribe((res) => {
      const { ok } = res;

      if (ok) {
        const { data } = res;
        this.contactos = data;
      }
    });
  }

  cerrarPanel() {
    this.cerrar.emit();
  }
}
