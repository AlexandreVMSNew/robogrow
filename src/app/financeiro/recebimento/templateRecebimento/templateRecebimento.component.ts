import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormaPagamentoService } from 'src/app/_services/Cadastros/FormaPagamento/formaPagamento.service';
import { PlanoPagamentoService } from 'src/app/_services/Cadastros/PlanoPagamento/planoPagamento.service';
import { ClienteService } from 'src/app/_services/Cadastros/Clientes/cliente.service';
import { DataService } from 'src/app/_services/Cadastros/Uteis/data.service';
import { PlanoContaService } from 'src/app/_services/Cadastros/PlanosConta/planoConta.service';
import { CentroReceitaService } from 'src/app/_services/Cadastros/CentroReceita/centroReceita.service';
import { RecebimentoService } from 'src/app/_services/Financeiro/Recebimentos/recebimento.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { ProdutoItem } from 'src/app/_models/Cadastros/Produtos/produtoItem';
import { CentroReceita } from 'src/app/_models/Cadastros/CentroReceita/CentroReceita';
import { PlanoContas } from 'src/app/_models/Cadastros/PlanoContas/planoContas';
import { Recebimentos } from 'src/app/_models/Financeiro/Recebimentos/Recebimentos';
import { RecebimentoParcelas } from 'src/app/_models/Financeiro/Recebimentos/RecebimentoParcelas';
import { PlanoPagamento } from 'src/app/_models/Cadastros/PlanoPagamento/PlanoPagamento';
import { FormaPagamento } from 'src/app/_models/Cadastros/FormaPagamento/FormaPagamento';
import * as moment from 'moment';
import { VendaValorRealizado } from 'src/app/_models/Movimentos/Venda/VendaValorRealizado';
import { Cliente } from 'src/app/_models/Cadastros/Clientes/Cliente';
import { VendaService } from 'src/app/_services/Movimentos/Venda/venda.service';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { Lancamentos } from 'src/app/_models/Movimentos/Lancamentos/Lancamentos';
import { LancamentoService } from 'src/app/_services/Movimentos/Lancamentos/lancamento.service';
import { ChequePreService } from 'src/app/_services/Cadastros/ChequePre/chequePre.service';
import { VendaConfig } from 'src/app/_models/Movimentos/Venda/VendaConfig';

@Component({
  selector: 'app-template-recebimento',
  templateUrl: './templateRecebimento.component.html',
  styleUrls: ['./templateRecebimento.component.css']
})
export class TemplateRecebimentoComponent implements OnInit {

  @Input() produtoItem: ProdutoItem;
  @Input() idVenda: number;
  @Input() vendaClienteId: number;
  @ViewChild('templateRecebimentos') templateRecebimentos: any;

  cadastroRecebimento: FormGroup;

  clientes: Cliente[];

  centrosReceita: CentroReceita[];
  centroReceitaIdSelecionado: any;

  planoContasReceita: PlanoContas[];
  planoContasIdSelecionado: any;

  recebimento: Recebimentos;
  parcelas: RecebimentoParcelas[] = [];

  planosPagamento: PlanoPagamento[];
  planoPagamentoIdSelecionado: any;

  formasPagamento: FormaPagamento[];
  formaPagamentoIdSelecionado: any;

  tipoPagamento: any;
  qtdParcelas: number;
  prazoPrimeiraParcela: number;
  intervaloParcelas: number;

  valorRealizado: VendaValorRealizado;
  idProdutoItemValorRealizado: number;

  vendaConfig: VendaConfig;

  templateEnabled = false;
  diasFixo = false;
  bsConfig: Partial<BsDatepickerConfig> = Object.assign({}, { containerClass: 'theme-dark-blue' });

  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private recebimentoService: RecebimentoService,
              private centroReceitaService: CentroReceitaService,
              private planoContaService: PlanoContaService,
              public dataService: DataService,
              private clienteService: ClienteService,
              private vendaService: VendaService,
              private permissaoService: PermissaoService,
              private planoPagamentoService: PlanoPagamentoService,
              private formaPagamentoService: FormaPagamentoService,
              private lancamentoService: LancamentoService,
              private chequePreService: ChequePreService) { }

  ngOnInit() {
    this.getPlanoPagamento();
    this.getFormaPagamento();
    this.getCentroReceita();
    this.getPlanoContas();
    this.getVendaConfig();
    this.validarRecebimentos();
    if (this.idVenda !== 0) {
      this.carregarRecebimentoVenda(this.produtoItem);
    }
  }

  carregarRecebimentoVenda(produtoItem: ProdutoItem) {
    this.centroReceitaIdSelecionado = produtoItem.centroReceitaId;
    this.planoContasIdSelecionado = produtoItem.planoContasId;
    this.idProdutoItemValorRealizado = produtoItem.id;
  }

  validarRecebimentos() {
    this.cadastroRecebimento = this.fb.group({
        id:  [''],
        clientesId: ['', Validators.required],
        dataEmissao: ['', Validators.required],
        dataCompetencia: [''],
        qtdParcelas: ['', Validators.required],
        valorTotal: ['', [Validators.required, Validators.min(1)]],
        planoPagamentoId: ['', Validators.required],
        centroReceitaId: [{value: '', disabled: true}, Validators.required],
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
    this.recebimento = new Recebimentos();
    this.recebimento.parcelas = [];
    const diaFixo = this.cadastroRecebimento.get('diasFixo').value;
    const dataEmissao = this.cadastroRecebimento.get('dataEmissao').value.toLocaleString();
    this.qtdParcelas = Number(this.getInfoPlanoPagamento(this.planoPagamentoIdSelecionado).qtdParcelas);
    this.prazoPrimeiraParcela = Number(this.getInfoPlanoPagamento(this.planoPagamentoIdSelecionado).prazoPrimeiraParcela);
    this.intervaloParcelas = Number(this.getInfoPlanoPagamento(this.planoPagamentoIdSelecionado).intervaloParcelas);
    this.formaPagamentoIdSelecionado = this.getInfoPlanoPagamento(this.planoPagamentoIdSelecionado).formaPagamentoId;
    const formaPag = this.getInfoPlanoPagamento(this.planoPagamentoIdSelecionado).formaPagamento;
    const valorTotal = this.cadastroRecebimento.get('valorTotal').value;
    const valorParcela = Number(Number(valorTotal) / this.qtdParcelas);
    for (let i = 0; i < this.qtdParcelas; i++) {
      const documentoText = (i + 1).toString();
      let diasSoma = 0;
      let mesSoma = 0;
      if (this.prazoPrimeiraParcela === 0) {
        if (i === 0) {
          mesSoma = 0;
          diasSoma = this.prazoPrimeiraParcela;
        } else {
          mesSoma = i;
          diasSoma = (this.intervaloParcelas * i);
        }
      } else {
        if (i === 0) {
          diasSoma = this.prazoPrimeiraParcela;
        } else {
          diasSoma = (this.intervaloParcelas * i) + this.prazoPrimeiraParcela;
        }
        mesSoma = i + 1;
      }

      const dataEmissaoSQL = moment(dataEmissao, 'DD/MM/YYYY').format('YYYY-MM-DD');
      const dataEmissaoPTBR = this.dataService.getDataPTBR(dataEmissaoSQL);
      const dataVencVariavel = moment(dataEmissaoPTBR, 'DD/MM/YYYY').add('days', diasSoma).format('YYYY-MM-DD');
      const dataVencFixoAux = moment(dataEmissaoPTBR, 'DD/MM/YYYY').add('months', mesSoma).format('YYYY-MM-DD');
      let dataVencFixo = (this.prazoPrimeiraParcela === 0 && i === 0) ? dataEmissaoPTBR :
                            this.dataService.getDataPTBR(this.setarDiaFixo(dataVencFixoAux, diaFixo));
      if (dataVencFixo.toString().substring(0, 5) === '30/02' || dataVencFixo.toString().substring(0, 5) === '29/02') {
        dataVencFixo = dataVencFixo.replace(dataVencFixo.toString().substring(0, 5), '01/03');
      }
      if (dataVencVariavel.toString().substring(5, 10) === '02-30' || dataVencFixo.toString().substring(5, 10) === '02-29') {
        dataVencFixo = dataVencFixo.replace(dataVencFixo.toString().substring(5, 10), '03-01');
      }
      const parcela = Object.assign({id: 0, documento: documentoText,
        dataVencimento: (this.diasFixo === true) ? dataVencFixo : this.dataService.getDataPTBR(dataVencVariavel),
        dataRecebimento: (i === 0 && (dataEmissaoSQL === dataVencVariavel || dataEmissaoSQL === dataVencFixo)) ? dataEmissaoSQL : null,
        valor: valorParcela,
        valorRecebido: ((i === 0 && (dataEmissaoSQL === dataVencVariavel || dataEmissaoSQL === dataVencFixo)) ||
                formaPag.descricao === 'CHEQUE') ? valorParcela : 0,
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
        centroReceitaId: this.centroReceitaIdSelecionado,
        descricao: 'VALOR PAGT - VENDA DE SISTEMA',
        planoDebitoId: (parcela.numeroParcela === 0 && this.prazoPrimeiraParcela === 0) ?
                        this.vendaConfig.planoContaRecebParcelaAVistaId : conta,
        planoCreditoId: this.planoContasIdSelecionado,
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

  lancarRecebimento() {
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    const dataEmissao = this.cadastroRecebimento.get('dataEmissao').value.toLocaleString();
    this.recebimento = Object.assign(this.cadastroRecebimento.value, {
      id: 0,
      vendaId: this.idVenda,
      clientesId: this.vendaClienteId,
      qtdParcelas: this.qtdParcelas,
      dataEmissao: this.dataService.getDataSQL(dataEmissao),
      produtosItensId: this.produtoItem.id,
      centroReceitaId: this.centroReceitaIdSelecionado,
      planoContasId: this.planoContasIdSelecionado,
      parcelas: []
    });

    this.recebimentoService.novoRecebimentos(this.recebimento).subscribe((_ID) => {
      const recebimentoParcelas: RecebimentoParcelas[] = [];
      this.parcelas.forEach((parcela) => {
        const parc = Object.assign(parcela, {
          id: 0,
          dataVencimento: this.dataService.getDataSQL(parcela.dataVencimento),
          formaPagamento: null,
          documento: _ID.toString() + '/' + parcela.documento,
          recebimentosId: _ID
        });
        recebimentoParcelas.push(parc);
      });

      this.recebimentoService.novoRecebimentoParcelas(recebimentoParcelas).subscribe(() => {
        this.valorRealizado = Object.assign({
          id: 0,
          vendaId: this.idVenda,
          produtosItensId: this.idProdutoItemValorRealizado,
          dataHoraUltAlt: dataAtual,
          recebimentos: null,
          recebimentosId: _ID,
        });
        this.vendaService.novoVendaValorRealizado(this.valorRealizado).subscribe(() => {
          this.toastr.success('Salvo com Sucesso!');
          this.efetuarLancamentos();
          this.vendaService.atualizarVenda();
          this.vendaService.atualizarRecebimentos();
          this.fecharTemplate(this.templateRecebimentos);
        }, error => {
          console.log(error.error);
          this.toastr.error(`Erro ao tentar inserir novo Valor Realizado : ${error.error}`);
        });
      }, error => {
        console.log(error.error);
        this.toastr.error(`Erro ao tentar inserir novo Recebimento Parcelas : ${error.error}`);
      });
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar inserir novo Recebimento: ${error.error}`);
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
    this.recebimentoService.setTemplateRecebimentoStatus(false);
    this.templateEnabled = false;
  }

  getTemplateChequePre() {
    return this.chequePreService.getChequePreTemplateStatus();
  }

  abrirTemplateChequePre() {
    this.chequePreService.setChequePreTemplateStatus(true);
  }

  getVendaConfig() {
    this.vendaService.getVendaConfig().subscribe(
      (_CONFIG: VendaConfig) => {
      this.vendaConfig = _CONFIG;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar VendaConfig: ${error.error}`);
    });
  }

  getPlanoContas() {
    this.planoContaService.getPlanosConta().subscribe(
      (_PLANOS: PlanoContas[]) => {
      this.planoContasReceita = _PLANOS.filter(c => c.tipo === 'RECEITA');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Planos de Contas: ${error.error}`);
    });
  }

  getClientes() {
    this.clienteService.getCliente().subscribe(
      (_CLIENTES: Cliente[]) => {
      this.clientes = _CLIENTES.filter(cliente => cliente.status !== 'INATIVO');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar clientes: ${error.error}`);
    });
  }

  getCentroReceita() {
    this.centroReceitaService.getCentroReceita().subscribe(
      (_CENTROS: CentroReceita[]) => {
      this.centrosReceita = _CENTROS.filter(c => c.status !== 'INATIVO');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Centros de Receita: ${error.error}`);
    });
  }

  getPlanoPagamento() {
    this.planoPagamentoService.getPlanoPagamento().subscribe(
      (_PLANOS: PlanoPagamento[]) => {
      this.planosPagamento = _PLANOS.filter(c => c.status !== 'INATIVO');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Planos de Pagamento: ${error.error}`);
    });
  }

  getFormaPagamento() {
    this.formaPagamentoService.getFormaPagamento().subscribe(
      (_FORMAS: FormaPagamento[]) => {
      this.formasPagamento = _FORMAS.filter(c => c.status !== 'INATIVO');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Formas de Pagamento: ${error.error}`);
    });
  }


}
