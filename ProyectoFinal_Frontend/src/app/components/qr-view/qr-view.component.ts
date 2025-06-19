import { Component } from '@angular/core';
import {QRCodeComponent} from 'angularx-qrcode'

@Component({
  selector: 'app-qr-view',
  imports: [QRCodeComponent],
  templateUrl: './qr-view.component.html',
  styleUrl: './qr-view.component.css'
})
export class QrViewComponent {

  qrLink:string='';

}
