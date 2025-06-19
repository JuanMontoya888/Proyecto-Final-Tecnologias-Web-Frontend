import { Component } from '@angular/core';
import {QRCodeComponent} from 'angularx-qrcode'
import { Reservacion } from '../../models/reservacion';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-qr-view',
  imports: [QRCodeComponent,
    MatCardModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './qr-view.component.html',
  styleUrl: './qr-view.component.css'
})
export class QrViewComponent {

  //variables
  reservacion!:Reservacion;
  qrLink:string='';

}
