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
  passwordRegister: string = '';
  name: string = '';
  lastName: string = '';

  constructor(private adminService: AdminService, private router: Router, private usersService: AuthenticateService, private receiveData: HotelService) { }

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

    this.usersService.loginWithEmail(this.username, this.password)
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
  getUserDB(uid: any): void {

    this.adminService.login(String(uid)).subscribe(
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


  createUser(): void {
    this.usersService.register(this.username, this.password)
      .then((result) => {

        const dataSend = {
          UID: result['uid'],
          authMethod: 'mail',
          isAvailable: true,
          name: this.name,
          username: String(this.name).replace(' ', '_') + String(result['uid']).slice(0, 2)
        };
        console.log(dataSend);
        this.adminService.createUser(dataSend).subscribe((res_api) => {
          Swal.fire(`Bienvenido ${this.name}`);
        });
        this.getUserDB(dataSend.UID);
        
        localStorage.setItem('adminLogueado', JSON.stringify(this.username));
        this.router.navigate(['/']);

      }).catch((error) => {
        Swal.fire('Error', `${error.message}`, 'error');
      });
  }
}
