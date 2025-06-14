import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private adminSubject = new BehaviorSubject<any>(this.getAdminLogueado());
  admin$ = this.adminSubject.asObservable();
  private urapi = 'http://127.0.0.1:3000';
  constructor(public http: HttpClient) { }

  // Retornaremos un observable, para que lo espera hasta que se complete
  getUser(uid: string): Observable<any> {
    return this.http.post(this.urapi + '/getUser', { uid });
  }

  loginWithEmail(email: string, password: string): Observable<any> {
    return this.http.post(this.urapi + '/login_email', { email, password });
  }

  loginWithPhoneNumber(phoneNumber: string): Observable<any> {
    return this.http.post(this.urapi + '/login_phoneNumber', { phoneNumber });
  }

  createUser(data: any): Observable<any> {
    return this.http.post(this.urapi + '/createUser', { data });
  }

  addUserGoogle(data: any): Observable<any> {
    return this.http.post(this.urapi + '/addUserGoogle', { data });
  }

  logout(): void {
    localStorage.removeItem('adminLogueado');
    this.adminSubject.next(null); // Notificamos que ya no hay admin logueado
  }

  getAdminLogueado(): any {
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
