import { CommonModule } from '@angular/common';
import { Component, Renderer2 } from '@angular/core'; // Ajusta la ruta si es necesario
import { AccesibilidadService } from '../../services/accesibilidad.service';

@Component({
  selector: 'app-accesibilidad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accesibilidad.component.html',
  styleUrl: './accesibilidad.component.css'
})
export class AccesibilidadComponent {
  menuAbierto = false;
  lecturaActiva = false;

  textoMenuAbierto = false;
  escala = 1;

  temaContraste = -1;
  totalTemas = 3;

  constructor(
    private renderer: Renderer2,
    public accesibilidadService: AccesibilidadService
  ) {
    // Restaurar preferencias
    const escalaGuardada = localStorage.getItem('escalaTexto');
    if (escalaGuardada) {
      this.escala = parseFloat(escalaGuardada);
      document.body.style.fontSize = `${this.escala}em`;
    }

    const temaGuardado = localStorage.getItem('temaContraste');
    if (temaGuardado !== null) {
      this.temaContraste = parseInt(temaGuardado);
      this.aplicarTemaContraste();
    }
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }


  leerContenido() {
    this.accesibilidadService.activarLector();
    this.lecturaActiva = true;
  }

  pararLectura() {
    this.accesibilidadService.desactivarLector();
    this.lecturaActiva = false;
  }

  cerrarMenu() {
    this.menuAbierto = false;
  }

  toggleTextoMenu(): void {
    this.textoMenuAbierto = !this.textoMenuAbierto;
  }

  aumentarTexto() {
    this.escala += 0.1;
    document.body.style.fontSize = `${this.escala}em`;
    localStorage.setItem('escalaTexto', String(this.escala));
    this.textoMenuAbierto = false;
  }

  disminuirTexto() {
    this.escala = Math.max(0.6, this.escala - 0.1);
    document.body.style.fontSize = `${this.escala}em`;
    localStorage.setItem('escalaTexto', String(this.escala));
    this.textoMenuAbierto = false;
  }

  restaurarTexto() {
    this.escala = 1;
    document.body.style.fontSize = '1em';
    localStorage.setItem('escalaTexto', String(this.escala));
    this.textoMenuAbierto = false;
  }

  cambiarContraste() {
    if (this.temaContraste >= 0) {
      this.renderer.removeClass(document.body, `contraste-tema-${this.temaContraste}`);
    }
    this.temaContraste = (this.temaContraste + 1) % this.totalTemas;
    this.aplicarTemaContraste();
    localStorage.setItem('temaContraste', String(this.temaContraste));
  }

  private aplicarTemaContraste() {
    this.renderer.addClass(document.body, `contraste-tema-${this.temaContraste}`);
  }
}
