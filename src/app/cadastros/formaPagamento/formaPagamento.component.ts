import { Component, OnInit, AfterViewChecked, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FormaPagamentoService } from 'src/app/_services/Cadastros/FormaPagamento/formaPagamento.service';
import { FormaPagamento } from 'src/app/_models/Cadastros/FormaPagamento/FormaPagamento';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { PermissaoObjetos } from 'src/app/_models/Permissoes/permissaoObjetos';

@Component({
  selector: 'app-forma-pagamento',
  templateUrl: './formaPagamento.component.html'
})
export class FormaPagamentoComponent implements OnInit, AfterViewChecked, AfterViewInit {

  formularioComponent = 'FORMAS DE PAGAMENTO';
  cadastrar = false;
  editar = false;
  listar = false;
  visualizar = false;
  excluir = false;


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
    if (modo === 'CADASTRAR') {
      this.cadastroForm.reset();
    } else if (modo === 'EDITAR') {
      this.carregarFormaPagamento(formaPagamento);
    }
    template.show();
  }

  cadastrarFormaPagamento(template: any) {
    this.formaPagamento = Object.assign(this.cadastroForm.value, {id: 0});
    this.formaPagamentoService.cadastrarFormaPagamento(this.formaPagamento).subscribe(
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
    this.formaPagamentoService.getFormaPagamento().subscribe(
      (_FORMAS: FormaPagamento[]) => {
      this.formasPagamento = _FORMAS;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Formas de Pagamento: ${error.error}`);
    });
  }

}
