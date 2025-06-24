import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaypalServiceService {
  constructor() { }

  loadPaypalScript(clientId: string, currency: string = 'MXN'): Promise<void> {
    return new Promise((resolve) => {
      if ((<any>window).paypal) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}`; 
      script.onload = () => resolve();
      script.onerror = () => {
        throw new Error('PayPal SDK failed to load.');
      };
      document.body.appendChild(script);
    });
  }
}
