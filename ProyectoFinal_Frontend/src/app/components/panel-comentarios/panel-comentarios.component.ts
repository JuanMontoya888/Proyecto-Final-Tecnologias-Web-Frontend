import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Testimonio } from '../../models/testimonios';
import { TESTIMONIOS_PREDETERMINADOS } from '../../models/testimonios';
import { OracionPipe } from '../../pipes/oracion.pipe';
import { EstrellasPipe } from '../../pipes/estrellas.pipe';
import { CapitalizarPipe } from '../../pipes/capitalizar.pipe';
import Swal from 'sweetalert2';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-panel-comentarios',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, EstrellasPipe, CapitalizarPipe, OracionPipe],
  templateUrl: './panel-comentarios.component.html',
  styleUrls: ['./panel-comentarios.component.css']
})
export class PanelComentariosComponent implements OnInit {
  @Output() cerrar = new EventEmitter<void>();
  comentarios: any = [];

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.getData();
  }

  eliminarComentario(index: number) {
    Swal.fire({
      title: '¿Eliminar este comentario?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.adminService.deleteComentariosByID(this.comentarios[index].id)
          .subscribe((res) => {
            const { ok } = res;

            if (ok) {
              Swal.fire('Eliminado', 'El comentario fue eliminado.', 'success');
              this.getData();
            }
          });
      }
    });
  }

  getData(): void {
    this.adminService.getComentarios().subscribe((res) => {
      const { ok } = res;

      if (ok) {
        const { data } = res;
        this.comentarios = data;
      }
    });
  }


  cerrarPanel() {
    this.cerrar.emit();
  }
}
