import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import Swal from 'sweetalert2';
import { AuthenticateService } from '../../services/authenticate.service';
import { NgClass } from '@angular/common';
import { HotelService } from '../../services/hotel.service';
import { AccesibilidadComponent } from '../accesibilidad/accesibilidad.component';
import { text } from 'express';
import { LectorVozDirective } from '../../directives/lector-voz.directive';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, AccesibilidadComponent, LectorVozDirective],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  
menuAbierto = false;

toggleMenu() {
  this.menuAbierto = !this.menuAbierto;
}

cerrarMenu() {
  this.menuAbierto = false;
}
  userLogueado: any = null;
  adminLogueado: any = null;
  isLogging: boolean = true;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private authService: AuthenticateService,
    private sendFlag: HotelService
  ) { }

  ngOnInit(): void {
    this.adminService.admin$.subscribe((data: any) => {
      if (!data) return;

      data.isAdmin ?
        this.adminLogueado = data.user : this.userLogueado = data.user;
    });
  }


  logout() {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: 'Tu sesión actual se cerrará.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.logout();
        this.authService.logout();
        this.userLogueado = this.adminLogueado = null;
        this.router.navigate(['/login']);

      }
    });
  }

  
cerrarMenuSiClickFuera(event: MouseEvent) {
  // Evita cerrar si haces click dentro del ul
  const ul = (event.currentTarget as HTMLElement).querySelector('ul');
  if (ul && ul.contains(event.target as Node)) {
    return;
  }
  this.cerrarMenu();
}
}
