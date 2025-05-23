import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hotel } from '../../models/hotel';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hotel-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './hotel-card.component.html',
  styleUrls: ['./hotel-card.component.css']
})
export class HotelCardComponent {
  @Input() hotel!: Hotel;

  constructor(private router: Router) {}

  irAReservacion() {
    this.router.navigate(['/reservacion', this.hotel.id]);
  }
}
