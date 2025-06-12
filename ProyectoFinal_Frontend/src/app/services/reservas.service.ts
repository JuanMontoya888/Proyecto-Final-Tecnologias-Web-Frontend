import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private url = 'http://localhost:3000/reservacion';
  constructor(public http : HttpClient) { }
  createPost(data:any):Observable<any>{
      return this.http.post(this.url,data);
  }

}