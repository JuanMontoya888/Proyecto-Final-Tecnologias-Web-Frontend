import { Component } from '@angular/core';
import { QRCodeComponent } from 'angularx-qrcode'
import { Reservacion } from '../../models/reservacion';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-qr-view',
  imports: [
    QRCodeComponent,
    MatCardModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './qr-view.component.html',
  styleUrl: './qr-view.component.css'
})
export class QrViewComponent {

  //variables
  reservacion!: Reservacion;
  qrLink: string = 'https://localhost:4200/infoReservacion:';

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

    this.qrLink += id;
  }

}
