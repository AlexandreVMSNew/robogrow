import { Component, OnInit, AfterViewChecked, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CentroReceita } from 'src/app/_models/Cadastros/CentroReceita/CentroReceita';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CentroReceitaService } from 'src/app/_services/Cadastros/CentroReceita/centroReceita.service';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { Permissao } from 'src/app/_models/Permissoes/permissao';
import { PermissaoObjetos } from 'src/app/_models/Permissoes/permissaoObjetos';

@Component({
  selector: 'app-centro-receita',
  templateUrl: './centroReceita.component.html'
})
export class CentroReceitaComponent implements OnInit, AfterViewChecked, AfterViewInit {

  formularioComponent = 'CENTRO DE RECEITAS';
  cadastrar = false;
  editar = false;
  listar = false;
  visualizar = false;
  excluir = false;

  cadastroForm: FormGroup;

  centrosReceita: CentroReceita[];

  centroReceita: CentroReceita;

  paginaAtual = 1;
  totalRegistros = 0; number;

  modo = '';

  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private centroReceitaService: CentroReceitaService,
              private permissaoService: PermissaoService,
              private changeDetectionRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.getCentroReceita();
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

  carregarCentroReceita(centroReceita: CentroReceita) {
    this.centroReceita = Object.assign({}, centroReceita);
    this.cadastroForm.patchValue(this.centroReceita);
  }

  validarForm() {
    this.cadastroForm = this.fb.group({
        id:  [''],
        descricao: ['', Validators.required],
        status: ['', Validators.required]
    });
  }

  abrirTemplateCentroReceita(modo: string, centroReceita: CentroReceita, template: any) {
    this.modo = modo;
    if (modo === 'CADASTRAR') {
      this.cadastroForm.reset();
    } else if (modo === 'EDITAR') {
      this.carregarCentroReceita(centroReceita);
    }
    template.show();
  }

  cadastrarCentroReceita(template: any) {
    this.centroReceita = Object.assign(this.cadastroForm.value, {id: 0});
    console.log(this.centroReceita);
    this.centroReceitaService.cadastrarCentroReceita(this.centroReceita).subscribe(
      () => {
        this.getCentroReceita();
        template.hide();
        this.toastr.success(`Cadastrado com Sucesso!`);
      }, error => {
        console.log(error.error);
      });
  }

  salvarCentroReceita(template: any) {
    this.centroReceita = Object.assign(this.cadastroForm.value);
    this.centroReceitaService.editarCentroReceita(this.centroReceita).subscribe(
      () => {
        this.getCentroReceita();
        template.hide();
        this.toastr.success(`Editado com Sucesso!`);
      }, error => {
        console.log(error.error);
      }
    );
  }

  getCentroReceita() {
    this.centroReceitaService.getCentroReceita().subscribe(
      (_CENTROS: CentroReceita[]) => {
      this.centrosReceita = _CENTROS;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Centros de Receita: ${error.error}`);
    });
  }

}
