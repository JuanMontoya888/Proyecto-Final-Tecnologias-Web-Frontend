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

  fuentesDisponibles = ['fuente-default', 'fuente-serif', 'fuente-mono'];
  fuenteActual = 'fuente-default';

  constructor(
    private renderer: Renderer2,
    public accesibilidadService: AccesibilidadService
  ) {
    // Restaurar tamaño del texto
    const escalaGuardada = localStorage.getItem('escalaTexto');
    if (escalaGuardada) {
      this.escala = parseFloat(escalaGuardada);
      document.body.style.fontSize = `${this.escala}em`;
    }

    // Restaurar tema de contraste
    const temaGuardado = localStorage.getItem('temaContraste');
    if (temaGuardado !== null) {
      this.temaContraste = parseInt(temaGuardado);
      this.aplicarTemaContraste();
    }

    // Restaurar tipo de fuente
    const fuenteGuardada = localStorage.getItem('tipoFuente');
    if (fuenteGuardada && this.fuentesDisponibles.includes(fuenteGuardada)) {
      this.fuenteActual = fuenteGuardada;
      this.renderer.addClass(document.body, this.fuenteActual);
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

  cambiarFuente() {
    // Remover clase anterior
    this.fuentesDisponibles.forEach(fuente => {
      this.renderer.removeClass(document.body, fuente);
    });

    // Calcular siguiente fuente
    const indiceActual = this.fuentesDisponibles.indexOf(this.fuenteActual);
    const nuevoIndice = (indiceActual + 1) % this.fuentesDisponibles.length;
    this.fuenteActual = this.fuentesDisponibles[nuevoIndice];

    // Aplicar clase nueva
    this.renderer.addClass(document.body, this.fuenteActual);

    // Guardar preferencia
    localStorage.setItem('tipoFuente', this.fuenteActual);
  }
}
