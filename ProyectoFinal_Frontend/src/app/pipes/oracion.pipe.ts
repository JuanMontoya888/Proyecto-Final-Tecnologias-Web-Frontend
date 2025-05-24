import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'oracion'
})
export class OracionPipe implements PipeTransform {
  transform(texto: string): string {
    if (!texto) return '';
    const lower = texto.toLowerCase().trim();
    let resultado = lower.charAt(0).toUpperCase() + lower.slice(1);

    if (!resultado.endsWith('.')) {
      resultado += '.';
    }

    return resultado;
  }
}
