import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ProdutoItem } from 'src/app/_models/Cadastros/Produtos/produtoItem';
import { Venda } from 'src/app/_models/Movimentos/Venda/Venda';
import { VendaValorRealizadoValores } from 'src/app/_models/Movimentos/Venda/VendaValorRealizadoValores';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { VendaService } from 'src/app/_services/Movimentos/Venda/venda.service';
import { PessoaService } from 'src/app/_services/Cadastros/Pessoas/pessoa.service';
import { DataService } from 'src/app/_services/Cadastros/Uteis/data.service';
import { VendaValorRealizado } from 'src/app/_models/Movimentos/Venda/VendaValorRealizado';
import { VendaValorPrevisto } from 'src/app/_models/Movimentos/Venda/VendaValorPrevisto';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-resumo-venda',
  templateUrl: './resumoVenda.component.html',
  styleUrls: ['./resumoVenda.component.css']
})
export class ResumoVendaComponent implements OnInit, AfterViewChecked {


  idVenda: number;
  venda: Venda;

  vendaItensEntrada: ProdutoItem[];
  vendaItensSaidaComissao: ProdutoItem[];
  vendaItensSaidaGasto: ProdutoItem[];


  idValorRealizado: number;
  realizadoEntradaValores: VendaValorRealizadoValores[] = [];
  realizadoSaidaComissaoValores: VendaValorRealizadoValores[] = [];
  realizadoSaidaGastoValores: VendaValorRealizadoValores[] = [];

  idValorPrevisto: number;
  previstoEntradaValores: VendaValorPrevisto[] = [];
  previstoSaidaComissaoValores: VendaValorPrevisto[] = [];
  previstoSaidaGastoValores: VendaValorPrevisto[] = [];

  subTipoItem: string;
  tipoItem: string;

  valorTotalEntradasPrevisto = 0;
  valorTotalEntradasRealizado = 0;

  valorTotalSaidasComissaoPrevisto = 0;
  valorTotalSaidasComissaoRealizado = 0;

  valorTotalSaidasGastoPrevisto = 0;
  valorTotalSaidasGastoRealizado = 0;

  verificarSoma = false;
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = value.toFixed(2).replace('.', ',');
          return 'R$' + label;
        },
      },
    }
  };
  public pieChartLabels: Label[] = ['ENTRADAS', 'COMISSÕES', 'GASTOS'];
  public pieChartData: number[] = [0, 0, 0];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      backgroundColor: ['rgba(0,192,239,1)', 'rgba(221,75,57,0.5)', 'rgba(221,75,57,1)'],
    },
  ];

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{ticks: {max: 5000, min: 0, stepSize: 1000}}] },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = value.toFixed(2).replace('.', ',');
          return 'R$' + label;
        },
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = ['RESULTADO'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    { data: [0], label: 'Entradas', backgroundColor: 'rgba(0,192,239,1)', hoverBackgroundColor: 'rgba(0,192,239,1)'},
    { data: [0], label: 'Saídas', backgroundColor: 'rgba(221,75,57,1)', hoverBackgroundColor: 'rgba(221,75,57,1)'}
  ];

  constructor(private toastr: ToastrService,
              private router: ActivatedRoute,
              private vendaService: VendaService,
              private pessoaService: PessoaService,
              public dataService: DataService,
              private changeDetectionRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.idVenda = +this.router.snapshot.paramMap.get('id');
    this.carregarVenda();
  }

  ngAfterViewChecked() {
    this.changeDetectionRef.detectChanges();
  }

  verificarMaiorZero(valor: number) {
    if (valor >= 0) {
      return true;
    } else {
      return false;
    }
  }

  somarValores(valores: any): number {
    let valorTotal = 0;
    if (valores) {
        if (valores.length > 0) {
      valores.forEach(item => {
          valorTotal = valorTotal + item.valor;
        });
      }
    }
    return valorTotal;
  }

  calcularDiferenca(valorRealizado: number, valorPrevisto: number): number {
    return valorPrevisto - valorRealizado;
  }

  calcularResultado(): number {
    const valorTotalSaida = this.valorTotalSaidasComissaoRealizado + this.valorTotalSaidasGastoRealizado;
    return this.valorTotalEntradasRealizado - valorTotalSaida;
  }

  somar(): any {
    if (this.verificarSoma === false) {
      this.valorTotalEntradasRealizado = this.somarValores(this.realizadoEntradaValores);
      this.valorTotalEntradasPrevisto = this.somarValores(this.previstoEntradaValores);
      this.valorTotalSaidasComissaoPrevisto = this.somarValores(this.previstoSaidaComissaoValores);
      this.valorTotalSaidasComissaoRealizado = this.somarValores(this.realizadoSaidaComissaoValores);
      this.valorTotalSaidasGastoRealizado = this.somarValores(this.realizadoSaidaGastoValores);
      this.valorTotalSaidasGastoPrevisto = this.somarValores(this.previstoSaidaGastoValores);
      this.pieChartData = [this.valorTotalEntradasRealizado, this.valorTotalSaidasComissaoRealizado, this.valorTotalSaidasGastoRealizado];
      this.barChartData[0].data = [this.valorTotalEntradasRealizado];
      this.barChartData[1].data = [this.valorTotalSaidasComissaoRealizado + this.valorTotalSaidasGastoRealizado];
      this.verificarSoma = true;
    }
    return '';
  }

  carregarVenda() {
    this.vendaService.getVendaById(this.idVenda).subscribe((_VENDA: Venda) => {
      this.venda = Object.assign({}, _VENDA);

      this.vendaItensEntrada = this.venda.vendaProdutos[0].produtos.itens.filter(item => item.tipoItem === 'ENTRADA');
      this.vendaItensEntrada.map(itemEntrada => {

        this.vendaService.getVendaValoresRealizadosByProdIdVendId(itemEntrada.id, this.idVenda)
          .subscribe((_VALORREALIZADO: VendaValorRealizado) => {
           if (_VALORREALIZADO) {
             this.realizadoEntradaValores = _VALORREALIZADO.vendaValorRealizadoValores;
             this.verificarSoma = false;
          }
        });

        this.vendaService.getVendaValorPrevistoByProdIdVendId(itemEntrada.id, this.idVenda)
          .subscribe((_VALORPREVISTO: VendaValorPrevisto) => {
          if (_VALORPREVISTO) {
            this.previstoEntradaValores.push(_VALORPREVISTO);
            this.verificarSoma = false;
          }
        });
      });

      this.vendaItensSaidaComissao = this.venda.vendaProdutos[0].produtos.itens.filter(
        item => item.tipoItem === 'SAIDA' && item.subTipoItem === 'COMISSÃO');
      this.vendaItensSaidaComissao.map(itemComissao => {

        this.vendaService.getVendaValorPrevistoByProdIdVendId(itemComissao.id, this.idVenda)
          .subscribe((_VALORPREVISTO: VendaValorPrevisto) => {
           if (_VALORPREVISTO) {
             this.previstoSaidaComissaoValores.push(_VALORPREVISTO);
             this.verificarSoma = false;
            }
        });

        this.vendaService.getVendaValoresRealizadosByProdIdVendId(itemComissao.id, this.idVenda)
          .subscribe((_VALORREALIZADO: VendaValorRealizado) => {
            if (_VALORREALIZADO) {
              _VALORREALIZADO.vendaValorRealizadoValores.map(_VALOR => {
                this.realizadoSaidaComissaoValores.push(_VALOR);
                this.verificarSoma = false;
              });
            }
        });

      });

      this.vendaItensSaidaGasto = this.venda.vendaProdutos[0].produtos.itens.filter(
        item => item.tipoItem === 'SAIDA' && item.subTipoItem === 'GASTO');
      this.vendaItensSaidaGasto.map(itemGasto => {

        this.vendaService.getVendaValoresRealizadosByProdIdVendId(itemGasto.id, this.idVenda)
          .subscribe((_VALORREALIZADO: VendaValorRealizado) => {
            if (_VALORREALIZADO) {
              _VALORREALIZADO.vendaValorRealizadoValores.map(_VALOR => {
                this.realizadoSaidaGastoValores.push(_VALOR);
                this.verificarSoma = false;
              });
            }
        });

        this.vendaService.getVendaValorPrevistoByProdIdVendId(itemGasto.id, this.idVenda)
          .subscribe((_VALORPREVISTO: VendaValorPrevisto) => {
           if (_VALORPREVISTO) {
             this.previstoSaidaGastoValores.push(_VALORPREVISTO);
             this.verificarSoma = false;
          }
        });

      });

    }, error => {
      this.toastr.error(`Erro ao tentar carregar Venda: ${error.error}`);
      console.log(error);
    });
  }

}
