import { ValidatorFn, AbstractControl } from '@angular/forms';

export class ValidatorsReserv {
  
    static nombreCompletoValidator(): ValidatorFn {
        return (control: AbstractControl) => {
          const valor = control.value?.trim() || '';
      
          if (!valor) return { nombreCompleto: 'Campo obligatorio' };
      
          const palabras = valor.split(/\s+/);
          if (palabras.length < 2) {
            return { nombreCompleto: 'Debe escribir al menos nombre y apellido' };
          }
      
          const todasConInicialMayuscula = palabras.every((palabra: string) =>
            /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+$/.test(palabra)
          );
      
          if (!todasConInicialMayuscula) {
            return { nombreCompleto: 'Cada palabra debe iniciar con mayúscula' };
          }
      
          return null;
        };
      }
      

      static rangoFechaValidator(min: Date, max: Date): ValidatorFn {
        return (group: AbstractControl) => {
          const inicio = group.get('fechaInicio')?.value;
          const fin = group.get('fechaFin')?.value;
      
          if (!inicio || !fin) return null;
      
          const fechaInicio = new Date(inicio);
          const fechaFin = new Date(fin);
      
          if (fechaInicio < min) {
            return { fechaInvalida: 'La fecha de inicio debe ser al menos con 15 días de anticipación.' };
          }
      
          if (fechaFin > max) {
            return { fechaInvalida: 'La fecha de fin no puede exceder 6 meses desde hoy.' };
          }

          const diferencia = fechaFin.getTime() - fechaInicio.getTime();
          const unDia = 1000 * 60 * 60 * 24;
      
          if (diferencia < unDia) {
            return { fechaInvalida: 'La fecha de fin debe ser al menos un día después de la de inicio.' };
          }
      
          return null;
        };
      }
      
}
