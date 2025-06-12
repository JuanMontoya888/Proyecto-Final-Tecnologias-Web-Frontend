import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Testimonio } from '../../models/testimonios';
import { TESTIMONIOS_PREDETERMINADOS } from '../../models/testimonios';
import { CapitalizarPipe } from '../../pipes/capitalizar.pipe';
import { EstrellasPipe } from '../../pipes/estrellas.pipe';
import { FormsModule } from '@angular/forms';
import { OracionPipe } from '../../pipes/oracion.pipe';


@Component({
  selector: 'app-testimonios',
  imports: [CommonModule,CapitalizarPipe,EstrellasPipe,OracionPipe, FormsModule],
  templateUrl: './testimonios.component.html',
  styleUrl: './testimonios.component.css'
})
export class TestimoniosComponent {
  testimonios: Testimonio[] = [];
  nuevo: Testimonio = { nombre: '', comentario: '', estrellas: 5 };

  ngOnInit() {
    const guardados = localStorage.getItem('testimonios');
    this.testimonios = guardados ? JSON.parse(guardados) : [...TESTIMONIOS_PREDETERMINADOS];
  }

  agregarTestimonio() {
    if (this.nuevo.nombre && this.nuevo.comentario) {
      this.testimonios.push({ ...this.nuevo });
      localStorage.setItem('testimonios', JSON.stringify(this.testimonios));
      this.nuevo = { nombre: '', comentario: '', estrellas: 5 };
    }
  }
}
