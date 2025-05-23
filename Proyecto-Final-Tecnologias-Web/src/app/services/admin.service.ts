import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private adminSubject = new BehaviorSubject<any>(this.getAdminLogueado());
  admin$ = this.adminSubject.asObservable();

  // private admins = [
  //   { username: 'admin1', password: '1234', nombre: 'María González' },
  //   { username: 'admin2', password: 'abcd', nombre: 'Carlos Pérez' },
  //   { username: 'admin3', password: '5678', nombre: 'Ana Ramírez' }
  // ];

  constructor(public http: HttpClient) { }

  // Retornaremos un observable, para que lo espera hasta que se complete
  login(username: string, password: string): Observable<any> {
    // const admin = this.admins.find(
    //   a => a.username === username && a.password === password
    // );
    // if (admin) {
    //   localStorage.setItem('adminLogueado', JSON.stringify(admin));
    //   this.adminSubject.next(admin); // Notificamos a todos los que estén suscritos
    // }
    // return admin || null;

    const urapi = 'http://localhost:3000/login';
    const body = { username, password };


    return this.http.post(urapi, body);
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
