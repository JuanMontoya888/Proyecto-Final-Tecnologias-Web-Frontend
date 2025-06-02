import { Component, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { FormsModule } from '@angular/forms';
import { LoaderService } from '../../services/loader.service';

import Swal from 'sweetalert2';
import { AuthenticateService } from '../../services/authenticate.service';
import { HotelService } from '../../services/hotel.service';

@Component({
  selector: 'app-login',
  imports: [RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  isLogging: boolean = false;
  email: string = '';
  passwordRegister: string = '';
  name: string = '';
  lastName: string = '';

  constructor(private adminService: AdminService, private router: Router, private authService: AuthenticateService, private receiveData: HotelService) { }

  ngOnInit(): void {
    this.receiveData.data$.subscribe(data => this.isLogging = data);
  }

  //Logueo por email
  loginWithEmail(): void {
    if (!this.username || !this.password) {
      Swal.fire('Atención', 'Por favor llena todos los campos', 'warning');
      return;
    }

    LoaderService.mostrar('Verificando credenciales...');

    this.authService.loginWithEmail(this.username, this.password)
      .then((uid) => {

        localStorage.setItem('adminLogueado', JSON.stringify(this.username));
        this.router.navigate(['/']);
        // This data came since service and it'll be used to find user name in data base for firebase 
        this.getUserDB(uid);
      })
      .catch((error) => {
        if (error.message === 'auth/email-not-verified') {
          Swal.fire('Error', 'Tu correo no ha sido confirmado', 'error');
        } else {
          Swal.fire('Error', `${error.message}`, 'error');
        }

      });
  }

  // This function will be used to get values of user, it can be logued with Email and password or another
  // This function to receive userData, this userData will come since firebase
  getUserDB(uid: string): void {

    this.adminService.login(uid).subscribe(
      (res: any) => {
        LoaderService.cerrar();
        console.log(res);
        const admin = res['user'];

        if (admin) {
          localStorage.setItem('adminLogueado', JSON.stringify(admin));

          LoaderService.cerrar();
          Swal.fire('¡Bienvenido!', `Hola ${admin['name']}`, 'success').then(() => {
            window.location.reload();
          });
          
          this.router.navigate(['/']);

        }
      },
      (error) => {
        LoaderService.cerrar();
        Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
      }
    );
  }


  createRegister(): void {

  }
}
