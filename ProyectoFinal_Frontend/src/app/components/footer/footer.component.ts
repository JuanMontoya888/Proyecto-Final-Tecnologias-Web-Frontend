import { Component } from '@angular/core';
import { LectorVozDirective } from '../../directives/lector-voz.directive';

@Component({
  selector: 'app-footer',
  imports: [LectorVozDirective],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

}
