import { Component } from '@angular/core';
import { HoteldistComponent } from '../hoteldist/hoteldist.component';
import { BargraphComponent } from '../bargraph/bargraph.component';
import { Reservacion } from '../../models/reservacion';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-mainview',
  imports: [HoteldistComponent,BargraphComponent],
  templateUrl: './mainview.component.html',
  styleUrl: './mainview.component.css'
})
export class MainviewComponent {

  
  allReservas:Reservacion[]=[];

  listaHoteles:string[]=[];
  listaMeses:number[]=[];

  contadorMeses:number[]=[];
  contadorHotel:number[]=[];

  constructor(private reservasServices:AdminService){}

  ngOnInit(): void {
    this.reservasServices.getAllReservas().subscribe(data => {
      this.allReservas=data.data;
      console.log('Reservas:',this.allReservas);
      this.procesarData();
    });
  }

  procesarData():void{
        this.allReservas.forEach((reservacion)=>{
          this.listaMeses.push(
            parseInt(reservacion.fechaInicio.substring(5,7),10)
          )

          this.listaHoteles.push(
            reservacion.hotel
          )
          
        })
        //inicializar arreglo
        for(let i=0; i<12;i++){
          this.contadorMeses[i]=0;
        }
        for(let i=0; i<10;i++){
          this.contadorHotel[i]=0;
        }


        //llenar contador

        this.listaMeses.forEach((mes)=>{
          this.contadorMeses[mes-1]++;
        })

        this.listaHoteles.forEach((hotel)=>{
          switch(hotel){
            case "Hotel Oasis": this.contadorHotel[0]++; break;
            case "Hotel Histórico": this.contadorHotel[1]++; break;
            case "Hotel Colonial": this.contadorHotel[2]++; break;
            case "Costa Dorada": this.contadorHotel[3]++; break;
            case "Hotel Sierra": this.contadorHotel[4]++; break;
            case "Hotel Económico Centro": this.contadorHotel[5]++; break;
            case "Hostal del Pueblo": this.contadorHotel[6]++; break;
            case "Casa Bonita": this.contadorHotel[7]++; break;
            case "Playa Azul Resort": this.contadorHotel[8]++; break;
            case "Gran Hotel Ejecutivo": this.contadorHotel[9]++; break;
          }
        });

        console.log('hoteles',this.listaHoteles);
        console.log('meses',this.listaMeses);
        console.log('hoteles-final  ',this.contadorHotel);
        console.log('meses-final',this.contadorMeses);
  }
}
