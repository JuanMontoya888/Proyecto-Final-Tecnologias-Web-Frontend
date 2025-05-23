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
    let admin;
    // Nos subscribimos al observable para cuando nos llegue el elemento este mande a 
    // llamar la callback
    this.adminService.login(this.username, this.password).subscribe((res: any) => {
      admin = res['user'];
      console.log(admin);

      if (admin) {
        localStorage.setItem('adminLogueado', JSON.stringify(admin));
        Swal.fire('¡Bienvenido!', `Hola ${admin['nombre']}`, 'success');
        this.router.navigate(['/']);
      } else {
        Swal.fire('Error', 'Usuario o contraseña incorrectos', 'error');
      }
    });

  }
}
