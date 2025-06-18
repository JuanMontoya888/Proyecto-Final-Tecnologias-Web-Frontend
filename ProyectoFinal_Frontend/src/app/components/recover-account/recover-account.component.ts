import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Router, RouterModule } from '@angular/router';
import { AuthenticateService } from '../../services/authenticate.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../services/loader.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recover-account',
  imports: [RouterModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './recover-account.component.html',
  styleUrl: './recover-account.component.css'
})
export class RecoverAccountComponent {
  recoverAccount!: FormGroup;
  code!: number;
  numberAttempts: number = 3;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private usersService: AuthenticateService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    const email = localStorage.getItem('email') ? JSON.parse(String(localStorage.getItem('email'))) : '';

    this.recoverAccount = this.formBuilder.group({
      email: [`${email}`, [Validators.required, Validators.email]],
      sendCodePressed: ['', Validators.required],
      code: ['', [Validators.required, Validators.pattern(/^[0-9]{4,6}$/)]],
      codeWasSent: ['', [Validators.required]],
    });
  }

  sendCode(): void {
    LoaderService.mostrar('Enviando código ...');
    this.adminService.sendCode(String(this.recoverAccount.get('email')?.value))
      .subscribe((res) => {
        const { ok, code } = res;

        this.code = Number(code);

        LoaderService.cerrar();
        if (ok) {
          this.recoverAccount.patchValue({ codeWasSent: true });
          Swal.fire({
            title: "Código enviado, revisa tu telefono",
            showClass: {
              popup: `animate__animated animate__fadeInUp animate__faster`
            },
            hideClass: {
              popup: `animate__animated animate__fadeOutDown animate__faster`
            }
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Ocurrió algún error, vuelva a intentar",
          });
        }
      }, (error) => {
        LoaderService.cerrar();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió algún error, vuelva a intentar",
        });
      });
  }

  validatedCode(): void {
    if (this.code !== this.recoverAccount.get('code')?.value) {
      this.numberAttempts--;

      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Codigo introducido incorrectamente ${3 - this.numberAttempts} veces`,
        footer: 'Se cancelara al 3er intento fallido'
      });

      if (this.numberAttempts === 0) this.router.navigate(['/login']);
    } else {
      LoaderService.mostrar('Verificando ...');

      this.adminService.unlockAccount(this.recoverAccount.get('email')?.value)
        .subscribe((res) => {
          const { ok } = res;

          LoaderService.cerrar();

          if (ok) {
            Swal.fire('Cuenta habilitada!', 'Tu cuenta ha sido habilitada', 'success');
            this.router.navigate(['/login']);
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Ocurrió algún error, vuelva a intentar",
            });
          }

        }, (error) => {
          LoaderService.cerrar();
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Ocurrió algún error, vuelva a intentar",
          });
        });
    }
  }

}
