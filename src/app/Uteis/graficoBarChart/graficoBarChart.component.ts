import { Component, OnInit, Input } from '@angular/core';
import { ChartType, ChartDataSets, ChartOptions } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-grafico-bar-chart',
  templateUrl: './graficoBarChart.component.html',
  styleUrls: ['./graficoBarChart.component.css']
})

export class GraficoBarChartComponent implements OnInit {

  @Input() barChartLabels: Label[] = [];
  @Input() barChartData: ChartDataSets[] = [];
  @Input() maxValor: number;
  @Input() minValor: number;
  @Input() frequencia: number;

  public barChartOptions: ChartOptions = null;

  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  constructor() { }

  ngOnInit() {
    this.barChartOptions = {
      responsive: true,
      tooltips: {
        callbacks: {
          label: (item, ctx) => {
            const texto = Number(item.value).toFixed(2).replace('.', ',');
            return 'R$ ' +  texto;
          }
        }
      },
      // We use these empty structures as placeholders for dynamic theming.
      scales: { xAxes: [{}], yAxes: [{ticks: {max: this.maxValor, min: this.minValor, stepSize: this.frequencia}}] },
      plugins: {
        datalabels: {
          formatter: (value, ctx) => {
            const label = value.toFixed(2).replace('.', ',');
            return '';
          },
          anchor: 'end',
          align: 'end',
        }
      }
    };
  }

}
