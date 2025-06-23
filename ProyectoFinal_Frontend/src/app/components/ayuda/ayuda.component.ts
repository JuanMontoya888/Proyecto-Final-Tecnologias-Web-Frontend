import { Component } from '@angular/core';
import { LectorVozDirective } from '../../directives/lector-voz.directive';

@Component({
  selector: 'app-ayuda',
  imports: [LectorVozDirective],
  templateUrl: './ayuda.component.html',
  styleUrl: './ayuda.component.css'
})
export class AyudaComponent {

}
