import { Component } from '@angular/core';
import { LectorVozDirective } from '../../directives/lector-voz.directive';

@Component({
  selector: 'app-header',
  imports: [LectorVozDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}
