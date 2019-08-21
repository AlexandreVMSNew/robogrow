import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Cliente } from 'src/app/_models/Cadastros/Clientes/Cliente';
import { CentroReceita } from 'src/app/_models/Cadastros/CentroReceita/CentroReceita';
import { CentroDespesa } from 'src/app/_models/Cadastros/CentroDespesa/centroDespesa';
import { PlanoContas } from 'src/app/_models/Cadastros/PlanoContas/planoContas';
import { Venda } from 'src/app/_models/Movimentos/Venda/Venda';
import { Recebimentos } from 'src/app/_models/Financeiro/Recebimentos/Recebimentos';
import { RecebimentoParcelas } from 'src/app/_models/Financeiro/Recebimentos/RecebimentoParcelas';
import { PlanoPagamento } from 'src/app/_models/Cadastros/PlanoPagamento/PlanoPagamento';
import { FormaPagamento } from 'src/app/_models/Cadastros/FormaPagamento/FormaPagamento';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { RecebimentoService } from 'src/app/_services/Financeiro/Recebimentos/recebimento.service';
import { CentroReceitaService } from 'src/app/_services/Cadastros/CentroReceita/centroReceita.service';
import { PlanoContaService } from 'src/app/_services/Cadastros/PlanosConta/planoConta.service';
import { DataService } from 'src/app/_services/Cadastros/Uteis/data.service';
import { ClienteService } from 'src/app/_services/Cadastros/Clientes/cliente.service';
import { PlanoPagamentoService } from 'src/app/_services/Cadastros/PlanoPagamento/planoPagamento.service';
import { FormaPagamentoService } from 'src/app/_services/Cadastros/FormaPagamento/formaPagamento.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { RecebimentoComponent } from '../recebimento.component';

@Component({
  selector: 'app-detalhar-recebimento',
  templateUrl: './detalharRecebimento.component.html',
  styleUrls: ['./detalharRecebimento.component.css']
})
export class DetalharRecebimentoComponent implements OnInit {

  @Input() idRecebimento: number;

  cadastroRecebimento: FormGroup;

  clientes: Cliente[];
  recebimentoClientesId: any;

  centrosReceita: CentroReceita[];
  centroReceitaIdSelecionado: any;

  planoContasReceita: PlanoContas[];
  planoContasIdSelecionado: any;

  idVenda: number;
  venda: Venda;

  recebimento: Recebimentos;
  parcelas: any = [];

  planosPagamento: PlanoPagamento[];
  planoPagamentoIdSelecionado: any;

  formasPagamento: FormaPagamento[];
  formaPagamentoIdSelecionado: any;

  templateEnabled = false;

  bsConfig: Partial<BsDatepickerConfig> = Object.assign({}, { containerClass: 'theme-dark-blue' });
  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private router: ActivatedRoute,
              private recebimentoService: RecebimentoService,
              private centroReceitaService: CentroReceitaService,
              private planoContaService: PlanoContaService,
              public dataService: DataService,
              private clienteService: ClienteService,
              private planoPagamentoService: PlanoPagamentoService,
              private formaPagamentoService: FormaPagamentoService,
              private changeDetectionRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.getCentroReceita();
    this.getFormaPagamento();
    this.getPlanoContas();
    this.getPlanoPagamento();
    this.validarRecebimentos();
    this.carregarRecebimento();
  }

  carregarRecebimento() {
    this.recebimento = null;
    this.recebimentoService.getRecebimentosById(this.idRecebimento)
      .subscribe(
        (_RECEBIMENTO: Recebimentos) => {
          this.recebimento = Object.assign(_RECEBIMENTO, {
            dataEmissao: this.dataService.getDataPTBR(_RECEBIMENTO.dataEmissao)
          });

          this.cadastroRecebimento.patchValue(this.recebimento);
          this.cadastroRecebimento.disable();
          this.parcelas = this.recebimento.parcelas;

          this.parcelas.forEach((parcela) => {
            parcela.dataVencimento = this.dataService.getDataPTBR(parcela.dataVencimento);
          });

          this.recebimentoClientesId = this.recebimento.clientesId;
          console.log(this.recebimento);

        }, error => {
          this.toastr.error(`Erro ao tentar carregar Recebimento: ${error.error}`);
          console.log(error);
        });
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
    this.recebimentoService.setDetalharRecebimentoStatus(false);
    this.templateEnabled = false;
  }

  getPlanoContas() {
    this.planoContaService.getAllPlanosConta().subscribe(
      (_PLANOS: PlanoContas[]) => {
      this.planoContasReceita = _PLANOS.filter(c => c.tipo === 'RECEITA');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Planos de Contas: ${error.error}`);
    });
  }

  getCentroReceita() {
    this.centroReceitaService.getAllCentroReceita().subscribe(
      (_CENTROS: CentroReceita[]) => {
      this.centrosReceita = _CENTROS.filter(c => c.status !== 'INATIVO');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Centros de Receita: ${error.error}`);
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

}
