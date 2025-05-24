import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estrellas'
})
export class EstrellasPipe implements PipeTransform {

  transform(valor: number): string {
    return '★'.repeat(valor) + '☆'.repeat(5 - valor);
  }

}
