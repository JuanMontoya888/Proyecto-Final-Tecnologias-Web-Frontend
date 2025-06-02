import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Hotel } from '../models/hotel';

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  private apiUrl = 'https://68107c7227f2fdac24119022.mockapi.io/hoteles';
  private dataSend = new BehaviorSubject<boolean>(true);
  data$ = this.dataSend.asObservable();


  constructor(private http: HttpClient) { }


  sendData(flag: boolean): void {
    this.dataSend.next(flag);
  }

  obtenerHoteles(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.apiUrl);
  }

}
