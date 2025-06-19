import { Component } from '@angular/core';
import { Reservacion } from '../../models/reservacion';
import { AdminService } from '../../services/admin.service';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-qr-result',
  imports: [MatCardModule,
    MatButtonModule,
    RouterModule],
  templateUrl: './qr-result.component.html',
  styleUrl: './qr-result.component.css'
})
export class QrResultComponent {
  reservacion!:Reservacion;
    
  
    constructor(adminService:AdminService){
      
    }

    

}
