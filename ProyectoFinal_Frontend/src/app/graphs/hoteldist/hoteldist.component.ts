import { Component, Input, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Hotel } from '../../models/hotel';
import { HotelService } from '../../services/hotel.service';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';

@Component({
  selector: 'app-hoteldist',
  imports: [BaseChartDirective],
  templateUrl: './hoteldist.component.html',
  styleUrl: './hoteldist.component.css'
})
export class HoteldistComponent {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
        @Input() reservacionesHoteles:number[]=/* [0,0,0,0,0,0,0,0,0,0]; */
        [1,2,3,4,5,6,7,8,9,11];



        hotelesOriginal: Hotel[] = [];
        listaHoteles:string[]=[]; //listado de los hoteles

      //control
      //probablemente sea mejor importar la lista de hoteles

      constructor(private hotelService: HotelService) {}

      ngOnInit(): void {
        this.hotelService.obtenerHoteles().subscribe(data => {
          this.hotelesOriginal = data;

          this.hotelesOriginal.forEach((hotel,index)=>{
            this.listaHoteles[index]=hotel.nombre;
          });

      console.log(this.listaHoteles);
      console.log("prueba,", this.reservacionesHoteles);

      this.chart?.update();
      
    });
  }

      
      


      // Pie
      public pieChartOptions: ChartConfiguration['options'] = {
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
          },
          title:{
              display: true,
              text: 'Reservaciones por Hotel',
              font:{
                family:"Helvetica",
                size: 20,
              },
              color:"#f0f0f0"
          },
        },
        elements:{
          
        }
       
      };
      public pieChartData: ChartData<'pie', number[], string | string[]> = {
        labels: this.listaHoteles,
        datasets: [
          {
            label: "Reservaciones: ",
            data: this.reservacionesHoteles,
            backgroundColor:[
              "#004c6d",'#006083','#007599','#008bad','#00a1c1',
              '#00b8d3','#00cfe3','#00e7f2','#00ffff','#00d0d0',
            ]
          },
        ],
        
      };
      public pieChartType: ChartType = 'pie';

      // events
      public chartClicked({
        event,
        active,}: {
        event: ChartEvent;
        active: object[];
      }): void {
        console.log(event, active);
        this.chart?.update();
      }

      public chartHovered({
        event,
        active,
      }: {
        event: ChartEvent;
        active: object[];
      }): void {
        //console.log(event, active);
        this.chart?.update();
      }

      public actualizar():void{
        console.log(this.reservacionesHoteles);
        this.pieChartData.datasets[0].data=this.reservacionesHoteles;
        this.chart?.update();
      }

      ngOnChanges(){
        this.actualizar();
      }

      ngAfterViewInit(){
        this.actualizar();
      }
     
}
