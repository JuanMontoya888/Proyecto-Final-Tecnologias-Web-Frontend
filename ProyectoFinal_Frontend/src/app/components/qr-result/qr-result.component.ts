import { Component } from '@angular/core';
import { Reservacion } from '../../models/reservacion';
import { AdminService } from '../../services/admin.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
    
  
  constructor(private route: ActivatedRoute, private adminService: AdminService) {

  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.adminService.getReservaByID(String(id))
      .subscribe((res) => {
       this.reservacion=res.data; 
       this.reservacion.fechaFin=this.reservacion.fechaFin.substring(0,10);
       this.reservacion.fechaInicio=this.reservacion.fechaInicio.substring(0,10);
      });

  }



}
