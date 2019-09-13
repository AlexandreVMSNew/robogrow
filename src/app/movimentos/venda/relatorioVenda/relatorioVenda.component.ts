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

@Component({
  selector: 'app-relatorio-venda',
  templateUrl: './relatorioVenda.component.html',
  styleUrls: ['./relatorioVenda.component.css']
})

export class RelatorioVendaComponent implements OnInit, AfterViewInit {

  vendas: Venda[];

  visualizarRelatorio = false;

  dataPeriodo: DataPeriodo;

  informacoes = Object.assign({});

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
  public barChartLabels: Label[] = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO',
   'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
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
        dataFinal: this.dataService.getDataSQL('31/12/2019') + 'T23:59:00'
      }
    );
    this.getVendas(this.dataPeriodo);
  }

  ngAfterViewInit() {
    this.permissaoService.getPermissoesByFormularioAcaoObjeto(
      Object.assign({formulario: 'RELATÓRIOS VENDA', acao: 'VISUALIZAR'})).subscribe((_PERMISSAO: Permissao) => {
      this.visualizarRelatorio = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
  }

  carregarInformacoes() {
    let valorTotalReceitasVendas = 0;
    let valorTotalDespesasVendas = 0;
    this.barChartData[0].data = [];
    this.barChartData[1].data = [];
    const quantidadeVendasEmNegociacao = this.vendas.filter(c => c.status === 'EM NEGOCIAÇÃO').length;
    const quantidadeVendasEmImplantacao = this.vendas.filter(c => c.status === 'EM IMPLANTAÇÃO').length;
    const quantidadeVendasFinalizado = this.vendas.filter(c => c.status === 'FINALIZADO').length;

    this.vendas.forEach((venda) => {
      if (venda.vendaValorRealizado && venda.status !== 'EM NEGOCIAÇÃO') {
        const valorRealizadoReceitas = venda.vendaValorRealizado.filter(c => c.recebimentosId !== null);
        if (valorRealizadoReceitas.length > 0) {
          valorRealizadoReceitas.forEach((receita) => {
            if (receita.recebimentos) {
              valorTotalReceitasVendas += receita.recebimentos.valorTotal;
            }
          });
        }

        const valorRealizadoDespesas = venda.vendaValorRealizado.filter(c => c.pagamentosId !== null);
        if (valorRealizadoDespesas.length > 0) {
          valorRealizadoDespesas.forEach((despesa) => {
            if (despesa.pagamentos) {
              valorTotalDespesasVendas += despesa.pagamentos.valorTotal;
            }
          });
        }
      }

    });
    const barChartArrayReceitas = [];
    const barChartArrayDespesas = [];
    for (let index = 0; index <= 11; index++) {

      let valorTotalReceitasMes = 0;
      let valorTotalDespesasMes = 0;
      const vendas = this.vendas.filter(c => moment(c.dataNegociacao, 'YYYY-MM-DD').month() === index);

      vendas.forEach((venda) => {
        if (venda.vendaValorRealizado && venda.status !== 'EM NEGOCIAÇÃO') {
          const valorRealizadoReceitas = venda.vendaValorRealizado.filter(c => c.recebimentosId !== null);
          if (valorRealizadoReceitas.length > 0) {
            valorRealizadoReceitas.forEach((receita) => {
              if (receita.recebimentos) {
                valorTotalReceitasMes += receita.recebimentos.valorTotal;
              }
            });
          }

          const valorRealizadoDespesas = venda.vendaValorRealizado.filter(c => c.pagamentosId !== null);
          if (valorRealizadoDespesas.length > 0) {
            valorRealizadoDespesas.forEach((despesa) => {
              if (despesa.pagamentos) {
                valorTotalDespesasMes += despesa.pagamentos.valorTotal;
              }
            });
          }
        }
      });

      barChartArrayReceitas.push(valorTotalReceitasMes);
      barChartArrayDespesas.push(valorTotalDespesasMes);
    }
    this.barChartData[0].data = barChartArrayReceitas;
    this.barChartData[1].data = barChartArrayDespesas;

    this.informacoes = Object.assign({
      quantidadeEmNegociacao: quantidadeVendasEmNegociacao,
      quantidadeEmImplantacao: quantidadeVendasEmImplantacao,
      quantidadeFinalizado: quantidadeVendasFinalizado,
      quantidadeTotal: quantidadeVendasEmImplantacao + quantidadeVendasFinalizado,
      valorLiquidoReceitas: valorTotalReceitasVendas - valorTotalDespesasVendas,
      valorMedio: (valorTotalReceitasVendas / (quantidadeVendasEmImplantacao + quantidadeVendasFinalizado)),
    });
  }

  setDataFiltro(valor: Date[]) {
    this.dataPeriodo = Object.assign(
      {
        dataInicial: this.dataService.getDataSQL(valor[0].toLocaleString()) + 'T00:00:00',
        dataFinal: this.dataService.getDataSQL(valor[1].toLocaleString()) + 'T23:59:00'
      }
    );
  }

  getVendas(dataPeriodo: DataPeriodo) {
    this.vendaService.getAllVendaRelatorio(dataPeriodo).subscribe(
      // tslint:disable-next-line:variable-name
      (_VENDAS: Venda[]) => {
      this.vendas = _VENDAS;
      this.carregarInformacoes();
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar VendaS: ${error.error}`);
    });
}

}
