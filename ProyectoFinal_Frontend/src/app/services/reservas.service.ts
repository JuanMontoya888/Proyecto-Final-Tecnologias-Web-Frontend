import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private url = 'https://proyecto-final-tecnologias-web-backend-0ehw.onrender.com/reservacion';
  constructor(public http : HttpClient) { }
  createPost(data:any):Observable<any>{
      return this.http.post(this.url,data);
  }
  obtenerReservas(): Observable<any> {
    return this.http.get(this.url);
  }
  actualizarReserva(id: string, data:any): Observable<any> {
  return this.http.put(`${this.url}/${id}`, data);
}
  eliminarReserva(id: string): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

}