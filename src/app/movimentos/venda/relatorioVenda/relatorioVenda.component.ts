import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { VendaService } from 'src/app/_services/Movimentos/Venda/venda.service';
import { Venda } from 'src/app/_models/Movimentos/Venda/Venda';
import { DataPeriodo } from 'src/app/_models/Cadastros/Uteis/DataPeriodo';
import { DataService } from 'src/app/_services/Cadastros/Uteis/data.service';
import { ChartType, ChartDataSets, ChartOptions } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
import * as moment from 'moment';
import { Permissao } from 'src/app/_models/Permissoes/permissao';
import { RelatorioVendas } from 'src/app/_models/Movimentos/RelatorioVendas/RelatorioVendas';
import { RelatorioGraficoResultadoPorMes } from 'src/app/_models/Movimentos/RelatorioVendas/RelatorioGraficoResultadoPorMes';

@Component({
  selector: 'app-relatorio-venda',
  templateUrl: './relatorioVenda.component.html',
  styleUrls: ['./relatorioVenda.component.css']
})

export class RelatorioVendaComponent implements OnInit, AfterViewInit {

  visualizarRelatorio = false;

  dataPeriodo: DataPeriodo;

  relatorioVendas: RelatorioVendas;

  public barChartOptions: ChartOptions = {
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
    scales: { xAxes: [{}], yAxes: [{ticks: {max: 26000, min: 0, stepSize: 2000}}] },
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
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    { data: [0], label: 'Receitas', backgroundColor: 'rgba(0,192,239,1)', hoverBackgroundColor: 'rgba(0,192,239,1)',
      borderColor: 'rgba(0,192,239,1)'},
    { data: [0], label: 'Despesas', backgroundColor: 'rgba(221,75,57,1)', hoverBackgroundColor: 'rgba(221,75,57,1)',
      borderColor: 'rgba(221,75,57,1)'}
  ];

  bsConfig: Partial<BsDatepickerConfig> = Object.assign({}, { containerClass: 'theme-dark-blue' });
  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService,
              public permissaoService: PermissaoService,
              private dataService: DataService,
              public vendaService: VendaService) { }

  ngOnInit() {
    this.dataPeriodo = Object.assign(
      {
        dataInicial: this.dataService.getDataSQL('01/01/2019') + 'T00:00:00',
        dataInicialPTBR: '01/01/2019',
        dataFinal: this.dataService.getDataSQL('31/12/2019') + 'T23:59:00',
        dataFinalPTBR: '31/12/2019',
      }
    );
    this.getVendas(this.dataPeriodo);
  }

  ngAfterViewInit() {

  }

  carregarInformacoes() {
    this.barChartData[0].data = [];
    this.barChartData[1].data = [];
    this.barChartLabels = [];
    const barChartArrayReceitas = [];
    const barChartArrayDespesas = [];

    this.relatorioVendas.graficoResultadoPorMes.forEach((resultadoMes: RelatorioGraficoResultadoPorMes) => {
      this.barChartLabels.push(resultadoMes.mes);
      barChartArrayReceitas.push(resultadoMes.valorReceitas);
      barChartArrayDespesas.push(resultadoMes.valorDespesas);
    });

    this.barChartData[0].data = barChartArrayReceitas;
    this.barChartData[1].data = barChartArrayDespesas;
  }

  setDataFiltro(valor: Date[]) {
    this.dataPeriodo = Object.assign(
      {
        dataInicial: this.dataService.getDataSQL(valor[0].toLocaleString()) + 'T00:00:00',
        dataInicialPTBR: valor[0].toLocaleString(),
        dataFinal: this.dataService.getDataSQL(valor[1].toLocaleString()) + 'T23:59:00',
        dataFinalPTBR: valor[1].toLocaleString()
      }
    );
  }

  getVendas(dataPeriodo: DataPeriodo) {
    this.vendaService.getVendaRelatorio(dataPeriodo).subscribe(
      (relatorioVendas: RelatorioVendas) => {
      this.relatorioVendas = relatorioVendas;
      this.carregarInformacoes();
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar VendaS: ${error.error}`);
    });
}

}
