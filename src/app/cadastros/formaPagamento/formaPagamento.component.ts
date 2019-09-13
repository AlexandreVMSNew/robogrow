import { Component, OnInit, AfterViewChecked, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FormaPagamentoService } from 'src/app/_services/Cadastros/FormaPagamento/formaPagamento.service';
import { FormaPagamento } from 'src/app/_models/Cadastros/FormaPagamento/FormaPagamento';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { Permissao } from 'src/app/_models/Permissoes/permissao';

@Component({
  selector: 'app-forma-pagamento',
  templateUrl: './formaPagamento.component.html'
})
export class FormaPagamentoComponent implements OnInit, AfterViewChecked, AfterViewInit {

  novo = true;
  editar = true;
  visualizar = true;

  cadastroForm: FormGroup;

  formasPagamento: FormaPagamento[];

  formaPagamento: FormaPagamento;

  paginaAtual = 1;
  totalRegistros = 0; number;

  modo = '';

  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private formaPagamentoService: FormaPagamentoService,
              private permissaoService: PermissaoService,
              private changeDetectionRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.getFormaPagamento();
    this.validarForm();
  }

  ngAfterViewInit() {
    this.permissaoService.getPermissoesByFormulario(
      Object.assign({formulario: 'FORMA DE PAGAMENTO'})).subscribe((_PERMISSOES: Permissao[]) => {
      this.novo = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'NOVO')[0]);
      this.editar = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'EDITAR')[0]);
      this.visualizar = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'VISUALIZAR')[0]);
    });
  }

  ngAfterViewChecked() {
    this.changeDetectionRef.detectChanges();
  }

  carregarFormaPagamento(formaPagamento: FormaPagamento) {
    this.formaPagamento = Object.assign({}, formaPagamento);
    this.cadastroForm.patchValue(this.formaPagamento);
  }

  validarForm() {
    this.cadastroForm = this.fb.group({
        id:  [''],
        descricao: ['', Validators.required],
        status: ['', Validators.required]
    });
  }

  abrirTemplateFormaPagamento(modo: string, formaPagamento: FormaPagamento, template: any) {
    this.modo = modo;
    if (modo === 'NOVO') {
      this.cadastroForm.reset();
    } else if (modo === 'EDITAR') {
      this.carregarFormaPagamento(formaPagamento);
    }
    template.show();
  }

  cadastrarFormaPagamento(template: any) {
    this.formaPagamento = Object.assign(this.cadastroForm.value, {id: 0});
    this.formaPagamentoService.novoFormaPagamento(this.formaPagamento).subscribe(
      () => {
        this.getFormaPagamento();
        template.hide();
        this.toastr.success(`Cadastrado com Sucesso!`);
      }, error => {
        console.log(error.error);
      });
  }

  salvarFormaPagamento(template: any) {
    this.formaPagamento = Object.assign(this.cadastroForm.value);
    this.formaPagamentoService.editarFormaPagamento(this.formaPagamento).subscribe(
      () => {
        this.getFormaPagamento();
        template.hide();
        this.toastr.success(`Editado com Sucesso!`);
      }, error => {
        console.log(error.error);
      }
    );
  }

  getFormaPagamento() {
    this.formaPagamentoService.getAllFormaPagamento().subscribe(
      (_FORMAS: FormaPagamento[]) => {
      this.formasPagamento = _FORMAS;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Formas de Pagamento: ${error.error}`);
    });
  }

}
