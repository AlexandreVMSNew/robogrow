import { Component, OnInit, AfterViewChecked, ChangeDetectorRef, Input } from '@angular/core';
import { ProdutoItem } from 'src/app/_models/Cadastros/Produtos/produtoItem';
import { Venda } from 'src/app/_models/Movimentos/Venda/Venda';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { VendaService } from 'src/app/_services/Movimentos/Venda/venda.service';
import { PessoaService } from 'src/app/_services/Cadastros/Pessoas/pessoa.service';
import { DataService } from 'src/app/_services/Cadastros/Uteis/data.service';
import { VendaValorPrevisto } from 'src/app/_models/Movimentos/Venda/VendaValorPrevisto';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-resultado-venda',
  templateUrl: './resultadoVenda.component.html',
  styleUrls: ['./resultadoVenda.component.css']
})
export class ResultadoVendaComponent implements OnInit, AfterViewChecked {

  @Input() venda: Venda;

  vendaItensReceita: ProdutoItem[];
  vendaItensDespesaComissao: ProdutoItem[];
  vendaItensDespesaGasto: ProdutoItem[];


  idValorRealizado: number;

  idValorPrevisto: number;
  previstoReceitaValores: VendaValorPrevisto[] = [ ];
  previstoDespesaComissaoValores: VendaValorPrevisto[] = [];
  previstoDespesaGastoValores: VendaValorPrevisto[] = [];

  realizadoReceitaValores = [];
  realizadoDespesaComissaoValores = [];
  realizadoDespesaGastoValores = [];
  subTipoItem: string;
  tipoItem: string;

  valorTotalReceitasPrevisto = 0;
  valorTotalReceitasRealizado = 0;

  valorTotalDespesasComissaoPrevisto = 0;
  valorTotalDespesasComissaoRealizado = 0;

  valorTotalDespesasGastoPrevisto = 0;
  valorTotalDespesasGastoRealizado = 0;

  valorDiferencaReceitas = 0;
  valorDiferencaDespesasComissao = 0;
  valorDiferencaDespesasGasto = 0;

  resultadoPrevisto = 0;
  resultadoReal = 0;
  porcentagemPrevistoReal = 0;

  verificarSoma = false;
  public pieChartOptions: ChartOptions = {
    tooltips: {
      callbacks: {
        label: (value, ctx) => {
          const texto = ctx.labels[value.index];
          return texto;
        },
        afterLabel: (value, ctx) => {
          const texto = Number(ctx.datasets[0].data[value.index]).toFixed(2).replace('.', ',');
          return 'R$ ' +  texto;
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
  public pieChartLabels: Label[] = ['RECEITAS', 'COMISSÕES', 'GASTOS'];
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
    tooltips: {
      callbacks: {
        label: (item, ctx) => {
          const texto = Number(item.value).toFixed(2).replace('.', ',');
          return '' +  texto;
        }
      },
    },
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
    { data: [0], label: 'Receitas', backgroundColor: 'rgba(0,192,239,1)', hoverBackgroundColor: 'rgba(0,192,239,1)',
      borderColor: 'rgba(0,192,239,1)'},
    { data: [0], label: 'Despesas', backgroundColor: 'rgba(221,75,57,1)', hoverBackgroundColor: 'rgba(221,75,57,1)',
      borderColor: 'rgba(221,75,57,1)'}
  ];

  constructor(private router: ActivatedRoute,
              private vendaService: VendaService,
              public dataService: DataService,
              private changeDetectionRef: ChangeDetectorRef) {
                this.vendaService.atualizaResultadoVenda.subscribe(x => {
                  this.carregarVenda();
                });
              }

  ngOnInit() {
    this.venda.id = +this.router.snapshot.paramMap.get('id');
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
          if (typeof item === 'object') {
            valorTotal = valorTotal + Number(item.valor);
          } else {
            valorTotal = valorTotal + Number(item);
          }
        });
      }
    }
    return valorTotal;
  }

  calcularDiferenca(valorRealizado: number, valorPrevisto: number): number {
    return valorPrevisto - valorRealizado;
  }

  calcularResultado(): number {
    const valorTotalDespesa = this.valorTotalDespesasComissaoRealizado + this.valorTotalDespesasGastoRealizado;
    return this.valorTotalReceitasRealizado - valorTotalDespesa;
  }

  calcularPorcentagemPrevistoReal() {
    return (this.resultadoReal / this.resultadoPrevisto) * 100;
  }
  somar(): any {
    if (this.verificarSoma === false) {
      this.valorTotalReceitasPrevisto = this.somarValores(this.previstoReceitaValores);
      this.valorTotalReceitasRealizado = this.somarValores(this.realizadoReceitaValores);
      this.valorTotalDespesasComissaoPrevisto = this.somarValores(this.previstoDespesaComissaoValores);
      this.valorTotalDespesasComissaoRealizado = this.somarValores(this.realizadoDespesaComissaoValores);
      this.valorTotalDespesasGastoRealizado = this.somarValores(this.realizadoDespesaGastoValores);
      this.valorTotalDespesasGastoPrevisto = this.somarValores(this.previstoDespesaGastoValores);
      this.valorDiferencaReceitas = this.calcularDiferenca(this.valorTotalReceitasRealizado, this.valorTotalReceitasPrevisto);
      this.valorDiferencaDespesasComissao = this.calcularDiferenca(this.valorTotalDespesasComissaoRealizado,
         this.valorTotalDespesasComissaoPrevisto);
      this.valorDiferencaDespesasGasto = this.calcularDiferenca(this.valorTotalDespesasGastoRealizado,
         this.valorTotalDespesasGastoPrevisto);
      this.resultadoPrevisto = this.valorTotalReceitasPrevisto - this.valorTotalDespesasComissaoPrevisto -
        this.valorTotalDespesasGastoPrevisto;
      this.resultadoReal = this.valorTotalReceitasRealizado - this.valorTotalDespesasComissaoRealizado -
        this.valorTotalDespesasGastoRealizado;
      this.porcentagemPrevistoReal = this.calcularPorcentagemPrevistoReal();

      this.pieChartData = [this.valorTotalReceitasRealizado, this.valorTotalDespesasComissaoRealizado,
        this.valorTotalDespesasGastoRealizado];
      this.barChartData[0].data = [this.valorTotalReceitasRealizado];
      this.barChartData[1].data = [this.valorTotalDespesasComissaoRealizado + this.valorTotalDespesasGastoRealizado];
      this.verificarSoma = true;
    }
    return '';
  }

  carregarVenda() {
    this.zerarVariaveis();

    if (this.venda) {
      this.vendaItensReceita = this.venda.vendaProdutos[0].produtos.itens.filter(item => item.tipoItem === 'RECEITA');
      this.vendaItensReceita.map(itemReceita => {
        const valorRealizadoItem = this.venda.vendaValorRealizado.filter(c => c.produtosItensId === itemReceita.id);
        if (valorRealizadoItem) {
          valorRealizadoItem.forEach(valorRealizado => {
            if (valorRealizado.recebimentos) {
              this.realizadoReceitaValores.push(valorRealizado.recebimentos.valorTotal);
            }
          });
          this.verificarSoma = false;
        }
        this.vendaService.getVendaValorPrevistoByProdIdVendId(itemReceita.id, this.venda.id)
          .subscribe((_VALORPREVISTO: VendaValorPrevisto) => {
          if (_VALORPREVISTO) {
            this.previstoReceitaValores.push(_VALORPREVISTO);
            this.verificarSoma = false;
          }
        });
      });

      this.vendaItensDespesaComissao = this.venda.vendaProdutos[0].produtos.itens.filter(
        item => item.tipoItem === 'DESPESA' && item.subTipoItem === 'COMISSÃO');
      this.vendaItensDespesaComissao.map(itemComissao => {

        const valorRealizadoItem = this.venda.vendaValorRealizado.filter(c => c.produtosItensId === itemComissao.id);
        if (valorRealizadoItem) {
          valorRealizadoItem.forEach(valorRealizado => {
            if (valorRealizado.pagamentos) {
              this.realizadoDespesaComissaoValores.push(valorRealizado.pagamentos.valorTotal);
            }
          });
          this.verificarSoma = false;
        }

        this.vendaService.getVendaValorPrevistoByProdIdVendId(itemComissao.id, this.venda.id)
          .subscribe((_VALORPREVISTO: VendaValorPrevisto) => {
           if (_VALORPREVISTO) {
             this.previstoDespesaComissaoValores.push(_VALORPREVISTO);
             this.verificarSoma = false;
            }
        });
      });

      this.vendaItensDespesaGasto = this.venda.vendaProdutos[0].produtos.itens.filter(
        item => item.tipoItem === 'DESPESA' && item.subTipoItem === 'GASTO');
      this.vendaItensDespesaGasto.map(itemGasto => {

        const valorRealizadoItem = this.venda.vendaValorRealizado.filter(c => c.produtosItensId === itemGasto.id);
        if (valorRealizadoItem) {
          valorRealizadoItem.forEach(valorRealizado => {
            if (valorRealizado.pagamentos) {
              this.realizadoDespesaGastoValores.push(valorRealizado.pagamentos.valorTotal);
            }
          });
          this.verificarSoma = false;
        }

        this.vendaService.getVendaValorPrevistoByProdIdVendId(itemGasto.id, this.venda.id)
          .subscribe((_VALORPREVISTO: VendaValorPrevisto) => {
           if (_VALORPREVISTO) {
             this.previstoDespesaGastoValores.push(_VALORPREVISTO);
             this.verificarSoma = false;
          }
        });

      });
    }
  }

  zerarVariaveis() {
    this.previstoReceitaValores = [];
    this.previstoDespesaComissaoValores = [];
    this.previstoDespesaGastoValores = [];

    this.realizadoReceitaValores = [];
    this.realizadoDespesaComissaoValores = [];
    this.realizadoDespesaGastoValores = [];

    this.valorTotalReceitasPrevisto = 0;
    this.valorTotalReceitasRealizado = 0;

    this.valorTotalDespesasComissaoPrevisto = 0;
    this.valorTotalDespesasComissaoRealizado = 0;

    this.valorTotalDespesasGastoPrevisto = 0;
    this.valorTotalDespesasGastoRealizado = 0;

    this.valorDiferencaReceitas = 0;
    this.valorDiferencaDespesasComissao = 0;
    this.valorDiferencaDespesasGasto = 0;

    this.resultadoPrevisto = 0;
    this.resultadoReal = 0;
    this.porcentagemPrevistoReal = 0;
  }
}
