import { Component, OnInit, Input } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';

@Component({
  selector: 'app-grafico-line-chart',
  templateUrl: './graficoLineChart.component.html',
  styleUrls: ['./graficoLineChart.component.css']
})

export class GraficoLineChartComponent implements OnInit {

  @Input() lineChartData: ChartDataSets[] = [];

  @Input() lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'red',
          }
        }
      ]
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = value.toFixed(2).replace('.', ',');
          return '';
        },
        anchor: 'end',
        align: 'end',
      }
    },
    annotation: {
      annotations: [],
    },
  };
  public lineChartColors: Color[] = [
     { // umidade
      // backgroundColor: 'rgba(0,0,255,0.3)',
      borderColor: 'blue',
      pointBackgroundColor: 'rgba(5,149,254,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(5,149,254,1)'
    },
    { // temperatura
      // backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'yellow',
      pointBackgroundColor: 'rgba(215,243,16,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(215,243,16,0.8)'
    },
    { // sensacao termica
      // backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'green',
      pointBackgroundColor: 'rgba(65,194,111,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(65,194,111,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [pluginAnnotations];

  constructor() { }

  ngOnInit() {
  }

}
