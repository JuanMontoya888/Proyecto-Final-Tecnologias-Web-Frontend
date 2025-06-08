import { Component, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoaderService } from '../../services/loader.service';

import Swal from 'sweetalert2';
import { AuthenticateService } from '../../services/authenticate.service';
import { HotelService } from '../../services/hotel.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [RouterModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // isLogging es usada para verificar que formulario esta siendo seleccionado, el recurso llega desde un observable
  // el cual esta esta enlazado desde otro componente
  isLogging: boolean = false;

  // Formularios reactivos para login y registro
  registerForm!: FormGroup;
  loginForm!: FormGroup;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private usersService: AuthenticateService,
    private receiveData: HotelService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.receiveData.data$.subscribe(data => this.isLogging = data);
    //Campos del formulario de logueo
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    //Campos del formulario de registro
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      passwordRepeated: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
    }, { Validators: this.passwordValidator() });
  }

  // Validador de contraseña para nuestro registro con email
  public passwordValidator(): any {
    return (group: FormGroup) => {
      const password = group.get('password')?.value;
      const repeated = group.get('passwordRepeted')?.value;
      return password === repeated ? null : { passwordMismatch: true }; //si es igual regresa un null, en caso de que no regresa un objeto con un true
    };
  }

  //Logueo por email
  loginWithEmail(): void {
    if (!this.loginForm.get('email')?.value || !this.loginForm.get('password')?.value) {
      Swal.fire('Atención', 'Por favor llena todos los campos', 'warning');
      return;
    }

    LoaderService.mostrar('Verificando credenciales...');

    this.usersService.loginWithEmail(String(this.loginForm.get('email')?.value), String(this.loginForm.get('password')?.value))
      .then((uid) => {

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
    this.usersService.register(String(this.registerForm.get('email')?.value), String(this.registerForm.get('password')?.value))
      .then((result) => {

        const dataSend = {
          UID: result['uid'],
          authMethod: 'mail',
          isAvailable: true,
          name: this.registerForm.get('name')?.value,
          username: String(this.registerForm.get('name')?.value).replace(' ', '_') + String(result['uid']).slice(0, 2),
          password: this.registerForm.get('password')?.value
        };
        console.log(dataSend);
        this.adminService.createUser(dataSend).subscribe((res_api) => {
          Swal.fire(`Bienvenido ${this.registerForm.get('name')?.value}`);
          this.getUserDB(dataSend.UID);
        });

        this.router.navigate(['/']);

      }).catch((error) => {
        Swal.fire('Error', `${error.message}`, 'error');
      });
  }
}
