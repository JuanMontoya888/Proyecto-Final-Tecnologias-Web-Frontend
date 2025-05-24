import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Hotel } from '../../models/hotel';
import { HotelService } from '../../services/hotel.service';
import { HotelCardComponent } from '../hotel-card/hotel-card.component';

@Component({
  selector: 'app-hoteles',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HotelCardComponent],
  templateUrl: './hoteles.component.html',
  styleUrls: ['./hoteles.component.css']
})
export class HotelesComponent implements OnInit {
  hotelesOriginal: Hotel[] = [];
  hotelesFiltrados: Hotel[] = [];
  termino: string = '';
  hotelSeleccionado: Hotel | null = null;

  constructor(private hotelService: HotelService) {}

  ngOnInit(): void {
    this.hotelService.obtenerHoteles().subscribe(data => {
      this.hotelesOriginal = data;
      this.hotelesFiltrados = data;
    });
  }

  buscar() {
    const valor = this.termino.toLowerCase();
    this.hotelesFiltrados = this.hotelesOriginal.filter(hotel =>
      hotel.nombre.toLowerCase().includes(valor) ||
      hotel.ciudad.toLowerCase().includes(valor)
    );
    this.hotelSeleccionado = null;
  }

  seleccionarHotel(hotel: Hotel) {
    this.hotelSeleccionado = hotel;
    console.log('Hotel seleccionado:', hotel);
  }
}
