import { Directive, ElementRef, HostListener } from '@angular/core';
import { AccesibilidadService } from '../services/accesibilidad.service';

@Directive({
  selector: '[appLectorVoz]'
})
export class LectorVozDirective {
  constructor(
    private el: ElementRef,
    private accesibilidadService: AccesibilidadService
  ) {}
 @HostListener('mouseenter') onEnter() {
    if (!this.accesibilidadService.lectorActivo || this.esDispositivoMovil()) return;
    const texto = this.el.nativeElement.innerText?.trim();
    if (texto) this.accesibilidadService.leerTexto(texto);
  }

  @HostListener('mouseleave') onLeave() {
    if (!this.accesibilidadService.lectorActivo || this.esDispositivoMovil()) return;
    this.accesibilidadService.cancelarLectura();
  }

  @HostListener('touchstart') onTouchStart() {
    if (!this.accesibilidadService.lectorActivo) return;
    const texto = this.el.nativeElement.innerText?.trim();
    if (texto) this.accesibilidadService.leerTexto(texto);
  }

  @HostListener('touchend') onTouchEnd() {
    if (!this.accesibilidadService.lectorActivo) return;
    this.accesibilidadService.cancelarLectura();
  }

  private esDispositivoMovil(): boolean {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }}
