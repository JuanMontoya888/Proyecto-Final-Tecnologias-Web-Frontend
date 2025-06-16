import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import Swal from 'sweetalert2';
import { AuthenticateService } from '../../services/authenticate.service';
import { NgClass } from '@angular/common';
import { HotelService } from '../../services/hotel.service';
import { AccesibilidadComponent } from '../accesibilidad/accesibilidad.component';
import { text } from 'express';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, NgClass, AccesibilidadComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
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
        this.router.navigate(['/login']);
      }
    });
  }
}
