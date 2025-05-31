import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import Swal from 'sweetalert2';
import { AuthenticateService } from '../../services/authenticate.service';


@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  adminLogueado: any = null;

  constructor(private adminService: AdminService, private router: Router, private authService: AuthenticateService) {}

  ngOnInit(): void {
    this.adminService.admin$.subscribe(admin => {
      this.adminLogueado = admin;
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
        this.router.navigate(['/login']);
        this.authService.logout();
      }
    });
  }
}
