import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { AuthenticateService } from '../../services/authenticate.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxCaptchaModule } from 'ngx-captcha';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { LoaderService } from '../../services/loader.service';


@Component({
  selector: 'app-register',
  imports: [RouterModule, FormsModule, ReactiveFormsModule, CommonModule, NgxCaptchaModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  // Formularios reactivos para login y registro
  registerForm!: FormGroup;
  siteKey: string = '6LfmU1wrAAAAAC5FKiiqp9c0ZKHZDT9VPo8JOwoc';

  constructor(
    private adminService: AdminService,
    private router: Router,
    private usersService: AuthenticateService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
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
      return password === repeated ? null : { passwordMismatch: true }; //si es igual regresa un null, en caso de que no regresa un objeto con un true
    };
  }


  loginWithGoogle(): void {
    this.usersService.loginWithGoogle()
      .then((user) => {
        let us;
        this.adminService.getUser(String(user.uid)).subscribe((res: any) => {
          us = res['user'];
        });

        if (us !== undefined) {
          // Convierte el nombre en formato correcto
          const fullName =
            String(user.displayName)?.split(' ').map(el => el.charAt(0).toUpperCase() + el.slice(1).toLowerCase()).join(' ');

          const userName = fullName.split(' ').slice(0, 2).join('_') + '_' + String(user?.uid).slice(0, 2);

          const dataSend = {
            UID: user.uid,
            authMethod: "google",
            isAvailable: true,
            isAdmin: false,
            attempts: 0,
            name: fullName,
            username: userName,
            email: user.email
          };

          this.adminService.addUserGoogle(dataSend).subscribe((res_api) => {
            Swal.fire(`Bienvenido ${user.name}`);
          });
        }
        this.getUserDB(user.uid);

        this.router.navigate(['/']);

      })
      .catch((error) => {
        let alertMessage, alertType;
        switch (error.code) {
          case 'auth/popup-closed-by-user':
            alertMessage = 'La ventana de inicio de sesión fue cerrada.';
            break;
          case 'auth/popup-blocked':
            alertMessage = 'Permite las ventanas emergentes para continuar.';
            break;
          case 'auth/network-request-failed':
            alertMessage = 'Verifica tu conexión a internet.';
            break;
          case 'auth/account-exists-with-different-credential':
            alertMessage = 'Ya existe una cuenta con este correo, pero con otro proveedor.';
            break;
          default:
            alertMessage = 'Error desconocido. Intenta más tarde.';
        }

        Swal.fire('Error', `${alertMessage}`, `error`);


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
          isAdmin: false,
          attempts: 0,
          name: fullName,
          username: userName,
          email: this.registerForm.get('email')?.value,
          password: this.registerForm.get('password')?.value
        };

        this.adminService.createUser(dataSend).subscribe((res_api) => {
          Swal.fire(`Bienvenido ${dataSend.name}`);
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
