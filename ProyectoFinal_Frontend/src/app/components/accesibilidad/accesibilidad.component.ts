import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-accesibilidad',
  imports: [CommonModule],
  templateUrl: './accesibilidad.component.html',
  styleUrl: './accesibilidad.component.css'
})
export class AccesibilidadComponent {
   menuAbierto = false;
  lecturaActiva = false;

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  leerContenido() {
    const texto = document.body.innerText;
    const voz = new SpeechSynthesisUtterance(texto);
    voz.lang = 'es-ES';
    window.speechSynthesis.speak(voz);
    this.lecturaActiva = true;
  }

  pararLectura() {
    window.speechSynthesis.cancel();
    this.lecturaActiva = false;
  }

  aumentarTexto() {
    document.body.style.fontSize = '1.2em';
  }

  contrasteAlto() {
    document.body.classList.toggle('contraste-alto');
  } 
}
