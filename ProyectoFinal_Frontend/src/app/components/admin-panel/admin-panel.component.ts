import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { PanelReservacionesComponent } from '../panel-reservaciones/panel-reservaciones.component';
import { PanelContactoComponent } from '../panel-contacto/panel-contacto.component';
import { PanelComentariosComponent } from '../panel-comentarios/panel-comentarios.component';
import { MainviewComponent } from "../../graphs/mainview/mainview.component";


@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    PanelReservacionesComponent,
    PanelContactoComponent,
    PanelComentariosComponent,
    MainviewComponent
],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  vista: 'reservaciones' | 'contacto' | 'comentarios' | null = null;
  adminNombre: string = '';
  reservas: any[] = []; // Cambia el tipo según tu modelo de datos

  constructor() {}

  ngOnInit(): void {
    const adminGuardado = localStorage.getItem('adminLogueado');
    this.adminNombre = adminGuardado ? JSON.parse(adminGuardado).nombre : '';
  }

  mostrarReservaciones() {
    this.vista = 'reservaciones';
  }

  mostrarContacto() {
    this.vista = 'contacto';
  }

  mostrarComentarios() {
    this.vista = 'comentarios';
  }

  cerrarVista() {
    this.vista = null;
  }
}
