import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizar'
})
export class CapitalizarPipe implements PipeTransform {

  transform(value: string): string {
    value = value.toLowerCase();

    //Separar a un arreglo las palabras

    let nombres = value.split(' ');
    
    for (let i in nombres) {
     //Poner en mayuscula la primer letra de cada palabra
      nombres[i] = nombres[i][0].toUpperCase() + nombres[i].substr(1);
    }

    //Unir todas las palabras de  nuevo.
    return nombres.join(' ');
  }

}
