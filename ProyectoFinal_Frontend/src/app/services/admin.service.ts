import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private adminSubject = new BehaviorSubject<any>(this.getAdminLogueado());
  admin$ = this.adminSubject.asObservable();
  private urapi = 'http://localhost:3000';
  constructor(public http: HttpClient) { }

  // Retornaremos un observable, para que lo espera hasta que se complete
  getUser(uid: string): Observable<any> {
    return this.http.post(this.urapi + '/getUser', { uid });
  }

  loginWithEmail(email: any, password: any): Observable<any> {
    return this.http.post(this.urapi + '/login_email', { email, password });
  }

  createUser(data: any): Observable<any> {
    return this.http.post(this.urapi + '/createUser', { data });
  }

  logout() {
    localStorage.removeItem('adminLogueado');
    this.adminSubject.next(null); // Notificamos que ya no hay admin logueado
  }

  getAdminLogueado() {
    const admin = localStorage.getItem('adminLogueado');
    return admin ? JSON.parse(admin) : null;
  }

  getServiciosSeleccionados(reservacion: any): string[] {
    if (!reservacion || !reservacion.servicios) {
      return [];
    }
    const servicios = [];
    if (reservacion.servicios.desayuno) {
      servicios.push('Desayuno');
    }
    if (reservacion.servicios.transporte) {
      servicios.push('Transporte');
    }
    if (reservacion.servicios.spa) {
      servicios.push('SPA');
    }
    return servicios;
  }

}
