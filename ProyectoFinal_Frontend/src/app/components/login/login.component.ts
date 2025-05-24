import { Component, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { FormsModule } from '@angular/forms';
import { LoaderService } from '../../services/loader.service';
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
      if (!this.username || !this.password) {
        Swal.fire('Atención', 'Por favor llena todos los campos', 'warning');
        return;
      }

      LoaderService.mostrar('Verificando credenciales...');

      this.adminService.login(this.username, this.password).subscribe(
        (res: any) => {
          LoaderService.cerrar();
          const admin = res['user'];

          if (admin) {
            localStorage.setItem('adminLogueado', JSON.stringify(admin));
            Swal.fire('¡Bienvenido!', `Hola ${admin['nombre']}`, 'success');
            this.router.navigate(['/']);
          } else {
            Swal.fire('Error', 'Usuario o contraseña incorrectos', 'error');
          }
        },
        (error) => {
          LoaderService.cerrar();
          Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
        }
      );
    }

}
