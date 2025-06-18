import { Component, Input, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-bargraph',
  imports: [BaseChartDirective],
  templateUrl: './bargraph.component.html',
  styleUrl: './bargraph.component.css'
})
export class BargraphComponent {
    @ViewChild(BaseChartDirective) chart: BaseChartDirective<'bar'> | undefined;

    @Input() datos:number[]=[2,3,3,3,3,3,3,3,3,3,2,2];

    public barChartOptions: ChartConfiguration<'bar'>['options'] = {
      // We use these empty structures as placeholders for dynamic theming.
      scales: {
        x: {
          grid:{
            color:'#f0f0f0',
          },
          title:{
            color:'#f0f0f0'
          }
        },
        y: {
          min: 0,
          grid:{
            color:'#f0f0f0'
          },
          title:{
            color:'#f0f0f0'
          }
        },
      },
      plugins: {
        legend: {
          display: true,
        },
        title:{
          display: true,
          text: 'Reservaciones por Mes',
          font:{
            family:"Helvetica",
            size: 20,
          },
          color:"#f0f0f0"
        }
        
      },
      elements:{
        line:{
          backgroundColor:'#f0f0f0',
          borderColor:'#f0f0f0'
        }
      }
    };
    public barChartType = 'bar' as const;

    public barChartData: ChartData<'bar'> = {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 
        'Octubre', 'Noviembre', 'Diciembre'],
      datasets: [
        { data: this.datos, label: 'Reservaciones',
          backgroundColor:'#005cbb' },
      ],
      
    };

    // events
    public chartClicked({
      event,
      active,
    }: {
      event?: ChartEvent;
      active?: object[];
    }): void {
      //console.log(event, active);
    }

    public chartHovered({
      event,
      active,
    }: {
      event?: ChartEvent;
      active?: object[];
    }): void {
      //console.log(event, active);
    }


}
