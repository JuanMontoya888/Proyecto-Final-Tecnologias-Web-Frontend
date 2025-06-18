import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { LoginComponent } from './components/login/login.component';
import { ReservacionComponent } from './components/reservacion/reservacion.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { HotelesComponent } from './components/hoteles/hoteles.component';
import { AyudaComponent } from './components/ayuda/ayuda.component';
import { RegisterComponent } from './components/register/register.component';
import { RecoverAccountComponent } from './components/recover-account/recover-account.component';



export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'nosotros', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reservacion/:id', component: ReservacionComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'admin', component: AdminPanelComponent },
  { path: 'hoteles', component: HotelesComponent },
  { path: 'ayuda', component: AyudaComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'recoverAccount', component: RecoverAccountComponent },
];
