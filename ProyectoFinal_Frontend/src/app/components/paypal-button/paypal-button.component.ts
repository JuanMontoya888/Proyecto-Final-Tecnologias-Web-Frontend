import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaypalServiceService } from '../../services/paypal-service.service';

@Component({
  selector: 'app-paypal-button',
  imports: [],
  templateUrl: './paypal-button.component.html',
  styleUrl: './paypal-button.component.css'
})
export class PaypalButtonComponent {
  @Input() monto!: number;
  @Output() confirmSale = new EventEmitter<{ok: boolean}>();

  constructor(private paypalService: PaypalServiceService) { }

  async ngAfterViewInit() {
    const clientId = 'AVdQjbrMD9LFcn9jNC7blMy0CYkDiHQx1jD9SGJNoF7W8Vz1KUDjv5RC9Eb4OLtZnLcdB0xf9hbmjzSM';
    await this.paypalService.loadPaypalScript(clientId);

    (<any>window).paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'blue',
        shape: 'pill',
        label: 'paypal',
      },
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            
            amount: {
              value: this.monto,
            }
          }]
        });
      },
      onApprove: async (data: any, actions: any) => {
        const details = await actions.order.capture();
        console.log('Pago aprobado:', details);
        this.confirmSale.emit({ok: true});
      },
      onError: (err: any) => {
        console.error('Error en el pago:', err);
        alert('Hubo un error procesando tu pago.');
      }
    }).render('#paypal-button-container');
  }
}
