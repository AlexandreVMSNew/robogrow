import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { VendaValorRealizado } from 'src/app/_models/Movimentos/Venda/VendaValorRealizado';
import { FormaPagamento } from 'src/app/_models/Cadastros/FormaPagamento/FormaPagamento';
import { PlanoPagamento } from 'src/app/_models/Cadastros/PlanoPagamento/PlanoPagamento';
import { PagamentoParcelas } from 'src/app/_models/Financeiro/Pagamentos/PagamentoParcelas';
import { Pagamentos } from 'src/app/_models/Financeiro/Pagamentos/Pagamentos';
import { PlanoContas } from 'src/app/_models/Cadastros/PlanoContas/planoContas';
import { CentroDespesa } from 'src/app/_models/Cadastros/CentroDespesa/centroDespesa';
import { Cliente } from 'src/app/_models/Cadastros/Clientes/Cliente';
import { ProdutoItem } from 'src/app/_models/Cadastros/Produtos/produtoItem';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PagamentoService } from 'src/app/_services/Financeiro/Pagamentos/pagamento.service';
import { CentroDespesaService } from 'src/app/_services/Cadastros/CentroDespesa/centroDespesa.service';
import { PlanoContaService } from 'src/app/_services/Cadastros/PlanosConta/planoConta.service';
import { DataService } from 'src/app/_services/Cadastros/Uteis/data.service';
import { ClienteService } from 'src/app/_services/Cadastros/Clientes/cliente.service';
import { VendaService } from 'src/app/_services/Movimentos/Venda/venda.service';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { PlanoPagamentoService } from 'src/app/_services/Cadastros/PlanoPagamento/planoPagamento.service';
import { FormaPagamentoService } from 'src/app/_services/Cadastros/FormaPagamento/formaPagamento.service';
import { LancamentoService } from 'src/app/_services/Movimentos/Lancamentos/lancamento.service';
import { Pessoa } from 'src/app/_models/Cadastros/Pessoas/Pessoa';
import { PessoaService } from 'src/app/_services/Cadastros/Pessoas/pessoa.service';
import * as moment from 'moment';
import { Lancamentos } from 'src/app/_models/Movimentos/Lancamentos/Lancamentos';
import { VendaConfig } from 'src/app/_models/Movimentos/Venda/VendaConfig';
@Component({
  selector: 'app-template-pagamento',
  templateUrl: './templatePagamento.component.html',
  styleUrls: ['./templatePagamento.component.css']
})
export class TemplatePagamentoComponent implements OnInit {

  @Input() produtoItem: ProdutoItem;
  @Input() idVenda: number;
  @Input() vendaClienteId: number;
  @ViewChild('templatePagamentos') templatePagamentos: any;

  cadastroPagamento: FormGroup;

  clientes: Cliente[];

  centrosDespesa: CentroDespesa[];
  centroDespesaIdSelecionado: any;

  planoContasDespesa: PlanoContas[];
  planoContasIdSelecionado: any;

  pagamento: Pagamentos;
  parcelas: PagamentoParcelas[] = [];

  pessoas: Pessoa[];
  pessoaIdSelecionado: number;

  planosPagamento: PlanoPagamento[];
  planoPagamentoIdSelecionado: any;

  formasPagamento: FormaPagamento[];
  formaPagamentoIdSelecionado: any;

  tipoPagamento: any;
  qtdParcelas: any;
  prazoPrimeiraParcela: any;
  intervaloParcelas: any;

  valorRealizado: VendaValorRealizado;
  idValorRealizado: number;
  idProdutoItemValorRealizado: number;

  vendaConfig: VendaConfig;

  templateEnabled = false;
  diasFixo = false;
  bsConfig: Partial<BsDatepickerConfig> = Object.assign({}, { containerClass: 'theme-dark-blue' });

  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private pagamentoService: PagamentoService,
              private centroDespesaService: CentroDespesaService,
              private planoContaService: PlanoContaService,
              public dataService: DataService,
              private pessoaService: PessoaService,
              private vendaService: VendaService,
              private permissaoService: PermissaoService,
              private planoPagamentoService: PlanoPagamentoService,
              private formaPagamentoService: FormaPagamentoService,
              private lancamentoService: LancamentoService) { }

  ngOnInit() {
    this.getPessoas();
    this.getPlanoContas();
    this.getFormaPagamento();
    this.getCentroDespesa();
    this.getPlanoPagamento();
    this.getVendaConfig();
    this.validarPagamentos();
    this.carregarPagamentoVenda(this.produtoItem);
  }

  carregarPagamentoVenda(produtoItem: ProdutoItem) {
    this.centroDespesaIdSelecionado = produtoItem.centroDespesaId;
    this.planoContasIdSelecionado = produtoItem.planoContasId;
    this.idProdutoItemValorRealizado = produtoItem.id;
  }

  validarPagamentos() {
    this.cadastroPagamento = this.fb.group({
        id:  [''],
        pessoasId: ['', Validators.required],
        dataEmissao: ['', Validators.required],
        dataCompetencia: [''],
        qtdParcelas: ['', Validators.required],
        valorTotal: ['', [Validators.required, Validators.min(1)]],
        planoPagamentoId: ['', Validators.required],
        centroDespesaId: [{value: '', disabled: true}, Validators.required],
        planoContasId: [{value: '', disabled: true}, Validators.required],
        diasFixo: ['10', [Validators.required, Validators.min(1)]],
        diasfixoCheck: ['']
    });
  }

  getInfoPlanoPagamento(idPlanoPagamento: number): PlanoPagamento {
    const info = this.planosPagamento.filter(c => c.id === idPlanoPagamento)[0];
    return info;
  }

  setarDiaFixo(data: string, dia: string) {
    if (data && data !== null && data.toString().length > 0) {
      const novaData = data.split('T')[0].split('-');
      const mes = novaData[1];
      const ano = novaData[0];
      return ano + '-' + mes + '-' + dia;
    } else {
      return '';
    }
  }

  gerarParcelas() {
    this.parcelas = [];
    this.pagamento = new Pagamentos();
    this.pagamento.parcelas = [];
    const diaFixo = this.cadastroPagamento.get('diasFixo').value;
    const dataEmissao = this.cadastroPagamento.get('dataEmissao').value.toLocaleString();
    this.qtdParcelas = this.getInfoPlanoPagamento(this.planoPagamentoIdSelecionado).qtdParcelas;
    this.prazoPrimeiraParcela = this.getInfoPlanoPagamento(this.planoPagamentoIdSelecionado).prazoPrimeiraParcela;
    this.intervaloParcelas = this.getInfoPlanoPagamento(this.planoPagamentoIdSelecionado).intervaloParcelas;
    this.formaPagamentoIdSelecionado = this.getInfoPlanoPagamento(this.planoPagamentoIdSelecionado).formaPagamentoId;
    const formaPag = this.getInfoPlanoPagamento(this.planoPagamentoIdSelecionado).formaPagamento;
    this.pagamento = Object.assign(this.cadastroPagamento.value, {
      id: 0,
      qtdParcelas: this.qtdParcelas,
      dataEmissao: this.dataService.getDataSQL(dataEmissao),
      centroDespesaId: this.centroDespesaIdSelecionado,
      planoContasId: this.planoContasIdSelecionado,
      produtosItensId: this.idProdutoItemValorRealizado,
      planoPagamento: null,
      planoPagamentoId: this.planoPagamentoIdSelecionado,
      parcelas: []
    });

    const valorTotal = this.cadastroPagamento.get('valorTotal').value;
    const valorParcela = Number(Number(valorTotal) / this.qtdParcelas);
    for (let i = 0; i < this.qtdParcelas; i++) {
      const documentoText = this.idVenda + '/' + (i + 1);
      let diasSoma = 0;
      let mesSoma = 0;
      if (Number(this.prazoPrimeiraParcela) === 0) {
        if (i === 0) {
          mesSoma = 0;
          diasSoma = Number(this.prazoPrimeiraParcela);
        } else {
          mesSoma = i;
          diasSoma = (Number(this.intervaloParcelas) * i);
        }
      } else {
        if (i === 0) {
          diasSoma = Number(this.prazoPrimeiraParcela);
        } else {
          diasSoma = Number(this.intervaloParcelas * i) + Number(this.prazoPrimeiraParcela);
        }
        mesSoma = i + 1;
      }
      const dataEmissaoSQL = moment(dataEmissao, 'DD/MM/YYYY').format('YYYY-MM-DD');
      const dataEmissaoPTBR = this.dataService.getDataPTBR(dataEmissaoSQL);
      const dataVencVariavel = moment(dataEmissaoPTBR, 'DD/MM/YYYY').add('days', diasSoma).format('YYYY-MM-DD');
      const dataVencFixoAux = moment(dataEmissaoPTBR, 'DD/MM/YYYY').add('months', mesSoma).format('YYYY-MM-DD');
      const dataVencFixo = (Number(this.prazoPrimeiraParcela) === 0 && i === 0) ? dataEmissaoPTBR :
                            this.dataService.getDataPTBR(this.setarDiaFixo(dataVencFixoAux, diaFixo));

      const parcela = Object.assign({id: 0, documento: documentoText,
        dataVencimento: (this.diasFixo === true) ? dataVencFixo : this.dataService.getDataPTBR(dataVencVariavel),
        dataPagamento: (i === 0 && (dataEmissaoSQL === dataVencVariavel || dataEmissaoSQL === dataVencFixo)) ? dataEmissaoSQL : null,
        valor: Number(valorParcela),
        valorPago: (Number(this.prazoPrimeiraParcela) === 0 && i === 0) ? Number(valorParcela) : 0,
        status: ((i === 0 && (dataEmissaoSQL === dataVencVariavel || dataEmissaoSQL === dataVencFixo)) ||
                formaPag.descricao === 'CHEQUE') ? 'PAGO' : 'PENDENTE',
        formaPagamentoId: this.formaPagamentoIdSelecionado,
        formaPagamento: formaPag,
        dataLancamento: dataEmissao,
        numeroParcela: i
      });
      this.parcelas.push(parcela);
    }
  }

  efetuarLancamentos() {
    let lancamentos: Lancamentos[];
    lancamentos = [];
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    this.parcelas.forEach((parcela) => {
      const conta = this.getInfoPlanoPagamento(this.planoPagamentoIdSelecionado).planoContasId;
      lancamentos.push(Object.assign({
        id: 0,
        centroDespesaId: this.centroDespesaIdSelecionado,
        descricao: 'VALOR PAGT - VENDA DE SISTEMA',
        planoDebitoId:  this.planoContasIdSelecionado,
        planoCreditoId: this.vendaConfig.planoContaPagParcelaAVistaId,
        valor: parcela.valor,
        usuarioId: this.permissaoService.getUsuarioId(),
        dataHora: dataAtual,
        dataLancamento: this.dataService.getDataSQL(parcela.dataLancamento)
      }));
    });
    this.lancamentoService.novosLancamentos(lancamentos).subscribe(() => {
      console.log('Lançamentos Efetuados.');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar inserir lancamentos : ${error.error}`);
    });
  }

  lancarPagamento() {
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    this.pagamento.parcelas = [];
    this.parcelas.forEach((parcela) => {
      const parc = Object.assign(parcela, {
        dataVencimento: this.dataService.getDataSQL(parcela.dataVencimento),
        formaPagamento: null
      });
      this.pagamento.parcelas.push(parc);
    });
    this.valorRealizado = Object.assign({
      id: 0,
      vendaId: this.idVenda,
      produtosItensId: this.idProdutoItemValorRealizado,
      dataHoraUltAlt: dataAtual,
      pagamentos: this.pagamento
    });

    this.vendaService.novoVendaValorRealizado(this.valorRealizado).subscribe(() => {
      this.vendaService.getIdUltimoValorRealizado().subscribe((_ID: VendaValorRealizado) => {
        this.idValorRealizado = _ID.id;
        this.toastr.success('Salvo com Sucesso!');
        this.efetuarLancamentos();
        this.vendaService.atualizarVenda();
        this.vendaService.atualizarPagamentos();
        this.fecharTemplate(this.templatePagamentos);
      });
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar inserir nova venda : ${error.error}`);
    });
  }

  getPessoas() {
    this.pessoaService.getAllPessoa().subscribe(
      // tslint:disable-next-line:variable-name
      (_PESSOAS: Pessoa[]) => {
      this.pessoas = _PESSOAS;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Pessoas: ${error.error}`);
    });
  }

  getVendaConfig() {
    this.vendaService.getVendaConfig().subscribe(
      (_CONFIG: VendaConfig) => {
      this.vendaConfig = _CONFIG;
      if (this.idVenda !== 0) {
        this.planoPagamentoIdSelecionado = this.vendaConfig.planoPagamentoSaidasId;
        this.cadastroPagamento.get('planoPagamentoId').disable();
      }
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar VendaConfig: ${error.error}`);
    });
  }

  getPlanoContas() {
    this.planoContaService.getAllPlanosConta().subscribe(
      (_PLANOS: PlanoContas[]) => {
      this.planoContasDespesa = _PLANOS.filter(c => c.tipo === 'DESPESA');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Planos de Contas: ${error.error}`);
    });
  }

  getCentroDespesa() {
    this.centroDespesaService.getAllCentroDespesa().subscribe(
      (_CENTROS: CentroDespesa[]) => {
      this.centrosDespesa = _CENTROS.filter(c => c.status !== 'INATIVO');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Centros de Despesa: ${error.error}`);
    });
  }

  getPlanoPagamento() {
    this.planoPagamentoService.getAllPlanoPagamento().subscribe(
      (_PLANOS: PlanoPagamento[]) => {
      this.planosPagamento = _PLANOS.filter(c => c.status !== 'INATIVO');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Planos de Pagamento: ${error.error}`);
    });
  }

  getFormaPagamento() {
    this.formaPagamentoService.getAllFormaPagamento().subscribe(
      (_FORMAS: FormaPagamento[]) => {
      this.formasPagamento = _FORMAS.filter(c => c.status !== 'INATIVO');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Formas de Pagamento: ${error.error}`);
    });
  }

  abrirTemplate(template: any) {
    if (this.templateEnabled === false) {
      template.show();
      this.templateEnabled = true;
    }
  }

  fecharTemplate(template: any) {
    template.hide();
    this.pagamentoService.setTemplatePagamentoStatus(false);
    this.templateEnabled = false;
  }

}
