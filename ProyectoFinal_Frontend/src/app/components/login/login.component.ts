import { Component, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoaderService } from '../../services/loader.service';
import { RecaptchaVerifier } from 'firebase/auth';

import Swal from 'sweetalert2';
import { AuthenticateService } from '../../services/authenticate.service';
import { CommonModule } from '@angular/common';
import { NgxCaptchaModule } from 'ngx-captcha';

@Component({
  selector: 'app-login',
  imports: [RouterModule, FormsModule, ReactiveFormsModule, CommonModule, NgxCaptchaModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // Reactive forms
  loginForm!: FormGroup;
  loginFormPhoneNumber!: FormGroup;

  recaptchaVerifier!: RecaptchaVerifier;
  isLoggingWithPhone: boolean = false;
  confirmationResult!: import("firebase/auth").ConfirmationResult;
  auth!: any;
  containerId!: any;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private usersService: AuthenticateService,
    private formBuilder: FormBuilder
  ) {
    this.auth = this.usersService.getAuth();
  }

  ngAfterViewInit(): void {
    this.recaptchaVerifier = new RecaptchaVerifier(this.auth, 'recaptcha-container', {
      size: 'invisible',
      callback: (response: any) => {
        console.log('reCAPTCHA resuelto:', response);
      }
    });

    this.recaptchaVerifier.render().then(widgetId => {
      console.log('reCAPTCHA renderizado con ID:', widgetId);
    });
  }

  ngOnInit(): void {
    //Campos del formulario de logueo
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.loginFormPhoneNumber = this.formBuilder.group({
      phoneNumber: ['', [Validators.required]],
      sendCodePressed: ['', Validators.required],
      code: ['', [Validators.required, Validators.pattern(/^[0-9]{4,6}$/)]],
    });

  }

  login(): void {
    this.isLoggingWithPhone ? this.loginWithPhoneNumber() : this.loginWithEmail();
  }

  sendCode(): void {
    LoaderService.mostrar('Verificando ...');
    this.adminService.loginWithPhoneNumber(String(this.loginFormPhoneNumber.get('phoneNumber')?.value))
      .subscribe((res) => {
        LoaderService.cerrar();
        const { ok } = res;
        if (ok) {
          this.usersService.loginWithPhoneNumber(String(this.loginFormPhoneNumber.get('phoneNumber')?.value), this.recaptchaVerifier)
            .then((result) => {
              this.confirmationResult = result;
              Swal.fire('Código enviado', 'Revisa tu teléfono', 'success');
            })
            .catch((err) => {
              console.error('Error al enviar código:', err);
              Swal.fire('Error', 'No se pudo enviar el código', 'error');
            });
        }
      }, (err) => {
        LoaderService.cerrar();
        Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
      });
  }

  loginWithPhoneNumber(): void {
    this.confirmationResult.confirm(this.loginFormPhoneNumber.get('code')?.value)
      .then((result) => {
        const user = result.user;
        this.getUserDB(user.uid);
      })
      .catch((error) => {
        console.error('Código incorrecto:', error);
        Swal.fire('Error', 'El código ingresado no es válido', 'error');
      });

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
            Swal.fire({
              title: "Error",
              text: "Tu cuenta fue bloqueada!",
              icon: "error",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Desbloquear cuenta"
            }).then((result) => {
              if (result.isConfirmed) {
                localStorage.setItem('email', JSON.stringify(this.loginForm.get('email')?.value));
                this.router.navigate(['/recoverAccount']);
              }
            });
          }
          else Swal.fire('Error', 'Correo incorrecto', 'error');

        }
      }, (err) => {
        LoaderService.cerrar();
        Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
      });
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


  // This function will be used to get values of user, it can be logued with Email and password or another
  // This function to receive userData, this userData will come since firebase
  getUserDB(uid: any): void {
    this.adminService.getUser(String(uid)).subscribe(
      (res: any) => {
        LoaderService.cerrar();
        console.log(res);
        const user = res['user'];

        if (user['isAdmin']) {
          localStorage.setItem('adminLogueado', JSON.stringify(user));
        } else {
          localStorage.setItem('userLogueado', JSON.stringify(user));
        }

        LoaderService.cerrar();
        Swal.fire('¡Bienvenido!', `Hola ${user['name']}`, 'success').then(() => {
          window.location.reload();
        });

        this.router.navigate(['/']);
      },
      (error) => {
        LoaderService.cerrar();
        Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
      }
    );
  }

}
