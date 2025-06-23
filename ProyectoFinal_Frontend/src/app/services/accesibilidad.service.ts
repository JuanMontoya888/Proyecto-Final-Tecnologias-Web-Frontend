import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccesibilidadService {
lectorActivo: boolean = false;
  private utterance: SpeechSynthesisUtterance | null = null;

  activarLector() {
    this.lectorActivo = true;
  }

  desactivarLector() {
    this.lectorActivo = false;
    this.cancelarLectura();
  }

  leerTexto(texto: string) {
    if (!this.lectorActivo || !texto.trim()) return;

    // Si hay una lectura activa, cancelarla antes de iniciar una nueva
    this.cancelarLectura();

    this.utterance = new SpeechSynthesisUtterance(texto);
    this.utterance.lang = 'es-ES';

    // Opcional: actualizar estado cuando termina la lectura
    this.utterance.onend = () => {
      this.utterance = null;
      // Puedes emitir un evento o callback si quieres avisar que terminó
    };

    window.speechSynthesis.speak(this.utterance);
  }

  cancelarLectura() {
    if (this.utterance) {
      window.speechSynthesis.cancel();
      this.utterance = null;
    }
  }
}
