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
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-panel-comentarios',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, EstrellasPipe, CapitalizarPipe, OracionPipe, ReactiveFormsModule],
  templateUrl: './panel-comentarios.component.html',
  styleUrls: ['./panel-comentarios.component.css']
})
export class PanelComentariosComponent implements OnInit {
  @Output() cerrar = new EventEmitter<void>();
  comentarios: any = [];
  editandoIndex: Number = -1;
  modifyForm!: FormGroup;

  constructor(private adminService: AdminService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getData();

    this.modifyForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      estrellas: [0, Validators.required],
      comentario: ['', Validators.required],
      index: [-1],
      id: [''],
    });
  }

  eliminarComentario(index: number): void {
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

  editarComentario(index: number): void {
    const editComent = this.comentarios[index];
    this.editandoIndex = index;
    console.log(editComent);
    this.modifyForm.patchValue({ ...editComent, index: index });

  }

  sendFormModify(): void {
    const data = {
      nombre: this.modifyForm.get('nombre')?.value,
      estrellas: this.modifyForm.get('estrellas')?.value,
      comentario: this.modifyForm.get('comentario')?.value
    };
    this.adminService.modifyComentariosByID(data, String(this.modifyForm.get('id')?.value)).subscribe(() => {
      this.getData();
    });

    this.editandoIndex = -1;
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
