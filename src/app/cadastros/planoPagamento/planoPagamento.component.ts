import { Component, OnInit, AfterViewChecked, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PlanoPagamento } from 'src/app/_models/Cadastros/PlanoPagamento/PlanoPagamento';
import { ToastrService } from 'ngx-toastr';
import { PlanoPagamentoService } from 'src/app/_services/Cadastros/PlanoPagamento/planoPagamento.service';
import { FormaPagamento } from 'src/app/_models/Cadastros/FormaPagamento/FormaPagamento';
import { FormaPagamentoService } from 'src/app/_services/Cadastros/FormaPagamento/formaPagamento.service';
import { PlanoContas } from 'src/app/_models/Cadastros/PlanoContas/planoContas';
import { PlanoContaService } from 'src/app/_services/Cadastros/PlanosConta/planoConta.service';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { Permissao } from 'src/app/_models/Permissoes/permissao';
import { PermissaoObjetos } from 'src/app/_models/Permissoes/permissaoObjetos';

@Component({
  selector: 'app-plano-pagamento',
  templateUrl: './planoPagamento.component.html',
  styleUrls: ['./planoPagamento.component.css']
})
export class PlanoPagamentoComponent implements OnInit, AfterViewChecked, AfterViewInit {

  formularioComponent = 'PLANOS DE PAGAMENTO';
  cadastrar = false;
  editar = false;
  listar = false;
  visualizar = false;
  excluir = false;

  cadastroForm: FormGroup;

  planosPagamento: PlanoPagamento[];

  planoPagamento: PlanoPagamento;

  formasPagamento: FormaPagamento[];
  formaPagamentoIdSelecionado = 0;

  planoContas: PlanoContas[];
  planoContasIdSelecionado = 0;

  paginaAtual = 1;
  totalRegistros = 0; number;

  modo = '';

  descricaoSugestao: string;

  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private planoPagamentoService: PlanoPagamentoService,
              private formaPagamentoService: FormaPagamentoService,
              private planoContaService: PlanoContaService,
              private permissaoService: PermissaoService,
              private changeDetectionRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.getPlanoPagamento();
    this.getPlanoContas();
    this.getFormaPagamento();
    this.validarForm();
  }

  ngAfterViewInit() {
    this.permissaoService.getPermissaoObjetosByFormularioAndNivelId(Object.assign({ formulario: this.formularioComponent }))
    .subscribe((permissaoObjetos: PermissaoObjetos[]) => {
      const permissaoFormulario = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'FORMULÁRIO');
      this.cadastrar = (permissaoFormulario !== null ) ? permissaoFormulario.cadastrar : false;
      this.editar = (permissaoFormulario !== null ) ? permissaoFormulario.editar : false;
      this.listar = (permissaoFormulario !== null ) ? permissaoFormulario.listar : false;
      this.visualizar = (permissaoFormulario !== null ) ? permissaoFormulario.visualizar : false;
      this.excluir = (permissaoFormulario !== null ) ? permissaoFormulario.excluir : false;
    }, error => {
      console.log(error.error);
    });
  }


  ngAfterViewChecked() {
    this.changeDetectionRef.detectChanges();
  }

  carregarPlanoPagamento(planoPagamento: PlanoPagamento) {
    this.planoPagamento = Object.assign({}, planoPagamento);
    this.cadastroForm.patchValue(this.planoPagamento);
  }

  validarForm() {
    this.cadastroForm = this.fb.group({
        id:  [''],
        formaPagamentoId: ['', Validators.required],
        descricao: ['', Validators.required],
        qtdParcelas: ['', Validators.required],
        prazoPrimeiraParcela: ['', [Validators.required, Validators.max(120), Validators.min(0)]],
        intervaloParcelas: ['', [Validators.required, Validators.max(365), Validators.min(0)]],
        juros: [0, [Validators.required, Validators.max(100), Validators.min(0)]],
        desconto: [0, [Validators.required, Validators.max(100), Validators.min(0)]],
        planoContasId: ['', Validators.required],
        status: ['', Validators.required]
    });
  }

  abrirTemplatePlanoPagamento(modo: string, planoPagamento: PlanoPagamento, template: any) {
    this.modo = modo;
    if (modo === 'CADASTRAR') {
      this.cadastroForm.reset();
    } else if (modo === 'EDITAR') {
      this.carregarPlanoPagamento(planoPagamento);
    }
    template.show();
  }

  cadastrarPlanoPagamento(template: any) {
    this.planoPagamento = Object.assign(this.cadastroForm.value, {id: 0,
       formaPagamentoId: this.formaPagamentoIdSelecionado,
       planoContasId: this.planoContasIdSelecionado
      });
    this.planoPagamentoService.cadastrarPlanoPagamento(this.planoPagamento).subscribe(
      () => {
        this.getPlanoPagamento();
        template.hide();
        this.toastr.success(`Cadastrado com Sucesso!`);
      }, error => {
        console.log(error.error);
      });
  }

  salvarPlanoPagamento(template: any) {
    this.planoPagamento = Object.assign(this.cadastroForm.value, { formaPagamentoId: this.formaPagamentoIdSelecionado});
    this.planoPagamentoService.editarPlanoPagamento(this.planoPagamento).subscribe(
      () => {
        this.getPlanoPagamento();
        template.hide();
        this.toastr.success(`Editado com Sucesso!`);
      }, error => {
        console.log(error.error);
      }
    );
  }

  getPlanoPagamento() {
    this.planoPagamentoService.getPlanoPagamento().subscribe(
      (_FORMAS: PlanoPagamento[]) => {
      this.planosPagamento = _FORMAS;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Planos de Pagamento: ${error.error}`);
    });
  }

  getFormaPagamento() {
    this.formaPagamentoService.getFormaPagamento().subscribe(
      (_FORMAS: FormaPagamento[]) => {
      this.formasPagamento = _FORMAS;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Formas de Pagamentos: ${error.error}`);
    });
  }

  getPlanoContas() {
    this.planoContaService.getPlanosConta().subscribe(
      (_PLANOS: PlanoContas[]) => {
      this.planoContas = _PLANOS.filter(c => c.tipo === 'MOVIMENTO' && c.categoria === 'ANALÍTICA');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Plano de Contas: ${error.error}`);
    });
  }


}
