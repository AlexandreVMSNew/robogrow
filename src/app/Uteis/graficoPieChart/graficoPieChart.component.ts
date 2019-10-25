import { Component, OnInit, Input } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-grafico-pie-chart',
  templateUrl: './graficoPieChart.component.html',
  styleUrls: ['./graficoPieChart.component.css']
})
export class GraficoPieChartComponent implements OnInit {


  public pieChartOptions: ChartOptions = {
    tooltips: {
      callbacks: {
        label: (value, ctx) => {
          const texto = Number(ctx.datasets[0].data[value.index]).toFixed(2).replace('.', ',');
          return texto;
        },
        afterLabel: (value, ctx) => {
          return '';
        },
      }
    },
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          return '';
        },
      },
    }
  };
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = false;
  public pieChartPlugins = [pluginDataLabels];


  @Input() pieChartLabels: Label[] = ['texto'];
  @Input() pieChartData: number[] = [];
  @Input() pieChartColors = [
    {
      backgroundColor: [],
    },
  ];
  constructor() { }

  ngOnInit() {
  }

}
