import { Component, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [RouterModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private adminService: AdminService, private router: Router) {}

  login() {
    const admin = this.adminService.login(this.username, this.password);

    if (admin) {
      localStorage.setItem('adminLogueado', JSON.stringify(admin));
      Swal.fire('¡Bienvenido!', `Hola ${admin.nombre}`, 'success');
      this.router.navigate(['/']);
    } else {
      Swal.fire('Error', 'Usuario o contraseña incorrectos', 'error');
    }
  }
}
