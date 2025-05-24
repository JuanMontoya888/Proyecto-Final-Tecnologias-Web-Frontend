import Swal from 'sweetalert2';

export class LoaderService {
  static mostrar(mensaje: string = 'Procesando...') {
    Swal.fire({
      title: mensaje,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  static cerrar() {
    Swal.close();
  }
}