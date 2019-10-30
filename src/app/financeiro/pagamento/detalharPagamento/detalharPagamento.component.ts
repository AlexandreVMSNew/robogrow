import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CentroDespesa } from 'src/app/_models/Cadastros/CentroDespesa/CentroDespesa';
import { PlanoContas } from 'src/app/_models/Cadastros/PlanoContas/planoContas';
import { Venda } from 'src/app/_models/Movimentos/Venda/Venda';
import { Pagamentos } from 'src/app/_models/Financeiro/Pagamentos/Pagamentos';
import { PlanoPagamento } from 'src/app/_models/Cadastros/PlanoPagamento/PlanoPagamento';
import { FormaPagamento } from 'src/app/_models/Cadastros/FormaPagamento/FormaPagamento';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PagamentoService } from 'src/app/_services/Financeiro/Pagamentos/pagamento.service';
import { CentroDespesaService } from 'src/app/_services/Cadastros/CentroDespesa/centroDespesa.service';
import { PlanoContaService } from 'src/app/_services/Cadastros/PlanosConta/planoConta.service';
import { DataService } from 'src/app/_services/Cadastros/Uteis/data.service';
import { PlanoPagamentoService } from 'src/app/_services/Cadastros/PlanoPagamento/planoPagamento.service';
import { FormaPagamentoService } from 'src/app/_services/Cadastros/FormaPagamento/formaPagamento.service';
import { PessoaService } from 'src/app/_services/Cadastros/Pessoas/pessoa.service';
import { Pessoa } from 'src/app/_models/Cadastros/Pessoas/Pessoa';
import { ProdutoItem } from 'src/app/_models/Cadastros/Produtos/produtoItem';

@Component({
  selector: 'app-detalhar-pagamento',
  templateUrl: './detalharPagamento.component.html',
  styleUrls: ['./detalharPagamento.component.css']
})
export class DetalharPagamentoComponent implements OnInit {

  @Input() idPagamento: number;
  @Input() produtoItem: ProdutoItem;

  cadastroPagamento: FormGroup;

  pessoas: Pessoa[];
  pessoaIdSelecionado: number;

  centrosDespesa: CentroDespesa[];
  centroDespesaIdSelecionado: any;

  planoContasDespesa: PlanoContas[];
  planoContasIdSelecionado: any;

  idVenda: number;
  venda: Venda;

  pagamento: Pagamentos;
  parcelas: any = [];

  planosPagamento: PlanoPagamento[];
  planoPagamentoIdSelecionado: any;

  formasPagamento: FormaPagamento[];
  formaPagamentoIdSelecionado: any;

  templateEnabled = false;

  bsConfig: Partial<BsDatepickerConfig> = Object.assign({}, { containerClass: 'theme-dark-blue' });
  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private pagamentoService: PagamentoService,
              private centroDespesaService: CentroDespesaService,
              private planoContaService: PlanoContaService,
              public dataService: DataService,
              private planoPagamentoService: PlanoPagamentoService,
              private formaPagamentoService: FormaPagamentoService,
              private pessoaService: PessoaService,
              private changeDetectionRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.getCentroDespesa();
    this.getPessoas();
    this.getFormaPagamento();
    this.getPlanoContas();
    this.getPlanoPagamento();
    this.validarPagamentos();
    this.carregarPagamento();
  }

  carregarPagamento() {
    this.pagamento = null;
    this.pagamentoService.getPagamentosById(this.idPagamento).subscribe((_PAGAMENTO: Pagamentos) => {

      this.pagamento = Object.assign(_PAGAMENTO, {
        dataEmissao: this.dataService.getDataPTBR(_PAGAMENTO.dataEmissao)
      });

      (!this.produtoItem) ? this.produtoItem = this.pagamento.produtosItens : this.produtoItem = this.produtoItem;

      this.pessoaIdSelecionado = this.pagamento.pessoasId;
      this.centroDespesaIdSelecionado = this.pagamento.centroDespesaId;
      this.planoPagamentoIdSelecionado = this.pagamento.planoPagamentoId;

      this.cadastroPagamento.patchValue(this.pagamento);
      this.cadastroPagamento.disable();
      this.parcelas = this.pagamento.parcelas;

      this.parcelas.forEach((parcela) => {
        parcela.dataVencimento = this.dataService.getDataPTBR(parcela.dataVencimento);
      });
    }, error => {
      console.log(error.error);
    });
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
    });
  }

  getPessoas() {
    this.pessoaService.getPessoa().subscribe(
      // tslint:disable-next-line:variable-name
      (_PESSOAS: Pessoa[]) => {
      this.pessoas = _PESSOAS;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Pessoas: ${error.error}`);
    });
  }

  getPlanoContas() {
    this.planoContaService.getPlanosConta().subscribe(
      (_PLANOS: PlanoContas[]) => {
      this.planoContasDespesa = _PLANOS.filter(c => c.tipo === 'DESPESA');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Planos de Contas: ${error.error}`);
    });
  }

  getCentroDespesa() {
    this.centroDespesaService.getCentroDespesa().subscribe(
      (_CENTROS: CentroDespesa[]) => {
      this.centrosDespesa = _CENTROS.filter(c => c.status !== 'INATIVO');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Centros de Despesa: ${error.error}`);
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

  abrirTemplate(template: any) {
    if (this.templateEnabled === false) {
      template.show();
      this.templateEnabled = true;
    }
  }

  fecharTemplate(template: any) {
    template.hide();
    this.pagamentoService.setDetalharPagamentoStatus(false);
    this.templateEnabled = false;
  }

}
