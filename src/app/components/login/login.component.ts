import { Component, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoaderService } from '../../services/loader.service';

import Swal from 'sweetalert2';
import { AuthenticateService } from '../../services/authenticate.service';
import { HotelService } from '../../services/hotel.service';
import { CommonModule } from '@angular/common';
import { NgxCaptchaModule } from 'ngx-captcha';
import { response } from 'express';
@Component({
  selector: 'app-login',
  imports: [RouterModule, FormsModule, ReactiveFormsModule, CommonModule, NgxCaptchaModule],
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
  siteKey: string = '6LfmU1wrAAAAAC5FKiiqp9c0ZKHZDT9VPo8JOwoc';

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
      recaptcha: ['', Validators.required]
    }, { validator: this.passwordValidator() });
  }

  // Validador de contraseña para nuestro registro con email
  public passwordValidator(): any {
    return (group: FormGroup) => {
      const password = group.get('password')?.value;
      const repeated = group.get('passwordRepeated')?.value;
      console.log(password, repeated)
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

    this.adminService.loginWithEmail(String(this.loginForm.get('email')?.value), String(this.loginForm.get('password')?.value))
      .subscribe((res) => {
        const { ok } = res;

        if (ok) {
          this.usersService.loginWithEmail(String(this.loginForm.get('email')?.value), String(this.loginForm.get('password')?.value))
            .then((resp) => {
              this.getUserDB(resp);
            })
            .catch((error) => {
              if (error.code === 'auth/email-not-verified') {
                Swal.fire('Error', 'Tu correo no ha sido confirmado', 'error');
              } else if (error.code === 'auth/email-already-in-use') {
                Swal.fire('Error', 'Este correo ya se encuentra registrado', 'error');
              } else {
                Swal.fire('Error', error.message, 'error');
              }
            });
        } else {
          const { message } = res;
          LoaderService.cerrar();

          if (message === 'incorrect-password') Swal.fire('Error', 'Contraseña incorrecta', 'error');
          else if (message === 'account-blocked') {
            Swal.fire('Error', 'Tu cuenta ha sido blockeada', 'error');
          }
          else Swal.fire('Error', 'Correo incorrecto', 'error');
          
        }
      }, (err) => {
        LoaderService.cerrar();
        Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
      });


  }

  createUser(): void {
    this.usersService.register(String(this.registerForm.get('email')?.value), String(this.registerForm.get('password')?.value))
      .then((result) => {

        // Convierte el nombre en formato correcto
        const fullName =
          String(this.registerForm.get('name')?.value).split(' ').map(el => el.charAt(0).toUpperCase() + el.slice(1).toLowerCase()).join(' ') + ' ' +
          String(this.registerForm.get('lastName')?.value).split(' ').map(el => el.charAt(0).toUpperCase() + el.slice(1).toLowerCase()).join(' ');

        const userName = fullName.split(' ').slice(0, 2).join('_') + '_' + String(result['uid']).slice(0, 2);


        const dataSend = {
          UID: result['uid'],
          authMethod: 'mail',
          isAvailable: true,
          attempts: 0,
          name: fullName,
          username: userName,
          email: this.registerForm.get('email')?.value,
          password: this.registerForm.get('password')?.value
        };

        this.adminService.createUser(dataSend).subscribe((res_api) => {
          Swal.fire(`Bienvenido ${this.registerForm.get('name')?.value}`);
          this.getUserDB(dataSend.UID);
        });

        this.router.navigate(['/']);

      }).catch((error) => {
        if (error.code === 'auth/email-not-verified') {
          Swal.fire('Error', 'Tu correo no ha sido confirmado', 'error');
        } else if (error.code === 'auth/email-already-in-use') {
          Swal.fire('Error', 'Este correo ya se encuentra registrado', 'error');
        } else {
          Swal.fire('Error', error.message, 'error');
        }
      });
  }


  // This function will be used to get values of user, it can be logued with Email and password or another
  // This function to receive userData, this userData will come since firebase
  getUserDB(uid: any): void {
    this.adminService.getUser(String(uid)).subscribe(
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

}
