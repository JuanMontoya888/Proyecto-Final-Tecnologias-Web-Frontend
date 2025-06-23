import { Component } from '@angular/core';
import { SafePipe } from '../../pipes/safe.pipe';
import { TestimoniosComponent } from '../testimonios/testimonios.component';
import { LectorVozDirective } from '../../directives/lector-voz.directive';

@Component({
  selector: 'app-home',
  imports: [SafePipe,TestimoniosComponent, LectorVozDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  promociones = [
    { titulo: 'Estancia Romántica', descripcion: 'Paquete para dos personas con cena incluida.', imagen: 'assets/imagenes/romantico.jpg' },
    { titulo: 'Viaje Familiar', descripcion: 'Habitaciones familiares y actividades para niños.', imagen: 'assets/imagenes/familia.jpg' },
    { titulo: 'Oferta Empresarial', descripcion: 'Descuentos para empresas y salas de juntas.', imagen: 'assets/imagenes/empresarial.jpg' },
  ];
}
