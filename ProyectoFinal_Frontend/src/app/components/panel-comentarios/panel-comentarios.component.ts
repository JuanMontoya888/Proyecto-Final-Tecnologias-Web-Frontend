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

@Component({
  selector: 'app-panel-comentarios',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, EstrellasPipe,CapitalizarPipe,OracionPipe],
  templateUrl: './panel-comentarios.component.html',
  styleUrls: ['./panel-comentarios.component.css']
})
export class PanelComentariosComponent implements OnInit {
  @Output() cerrar = new EventEmitter<void>();
  comentarios: Testimonio[] = [];

  ngOnInit(): void {
    const guardados = localStorage.getItem('testimonios');
    this.comentarios = guardados
      ? JSON.parse(guardados)
      : [...TESTIMONIOS_PREDETERMINADOS];
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
        this.comentarios.splice(index, 1);
        localStorage.setItem('testimonios', JSON.stringify(this.comentarios));
        Swal.fire('Eliminado', 'El comentario fue eliminado.', 'success');
      }
    });
  }


  cerrarPanel() {
    this.cerrar.emit();
  }
}
