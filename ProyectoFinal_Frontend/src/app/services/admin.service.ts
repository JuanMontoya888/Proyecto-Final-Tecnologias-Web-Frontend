import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private adminSubject = new BehaviorSubject<any>(this.getAdminLogueado());
  admin$ = this.adminSubject.asObservable();
  private urapi = 'https://proyecto-final-tecnologias-web-backend-0ehw.onrender.com';
  //private urapi = 'http://localhost:3000';
  constructor(public http: HttpClient) { }

  // Retornaremos un observable, para que lo espera hasta que se complete
  getUser(uid?: string, email?: string): Observable<any> {
    return email ?
      this.http.post(this.urapi + '/getUser', { email }) :
      this.http.post(this.urapi + '/getUser', { uid });
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
    localStorage.removeItem('userLogueado');
    this.adminSubject.next({ isAdmin: false, user: null });
  }

  getAdminLogueado(): any {
    try {
      const admin = localStorage.getItem('adminLogueado');
      const user = localStorage.getItem('userLogueado');

      if (admin) return { isAdmin: true, user: JSON.parse(admin) };
      if (user) return { isAdmin: false, user: JSON.parse(user) };

      return null;
    } catch (error) { return null; }
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

  sendCode(email: string): Observable<any> {
    return this.http.post(this.urapi + '/getCode', { email });
  }

  unlockAccount(email: string, newPassword: string): Observable<any> {
    return this.http.post(this.urapi + '/unlockAccount', { email, newPassword });
  }

  sendMail(email: string, reservacion: any, user: string): Observable<any> {
    return this.http.post(this.urapi + '/sendMail', { email, reservacion, user });
  }

  getAllReservas(): Observable<any> {
    return this.http.get<any>(this.urapi + '/getReservas');
  }

  getReservaByID(query: string): Observable<any> {
    return this.http.post(this.urapi + '/getReservaBy', { query });
  }

  addComentario(data: any): Observable<any> {
    return this.http.post(this.urapi + '/addComentario', { data });
  }

  getComentarios(): Observable<any> {
    return this.http.get(this.urapi + '/getComentarios');
  }

  deleteComentariosByID(id: string): Observable<any> {
    return this.http.delete(this.urapi + `/deleteComentariosByID/${id}`);
  }

  modifyComentariosByID(data: any, id: String): Observable<any> {
    return this.http.post(this.urapi + '/modifyComentariosByID', {data, id});
  }

  addContacto(data: any): Observable<any> {
    return this.http.post(this.urapi + '/addContacto', { data });
  }

  getContactos(): Observable<any> {
    return this.http.get(this.urapi + '/getContactos');
  }

  deleteContactosByID(id: string): Observable<any> {
    return this.http.delete(this.urapi + `/deleteContactosByID/${id}`);
  }

}
