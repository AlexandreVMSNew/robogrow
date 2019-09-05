import { Component, OnInit, AfterViewChecked, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CentroReceita } from 'src/app/_models/Cadastros/CentroReceita/CentroReceita';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CentroReceitaService } from 'src/app/_services/Cadastros/CentroReceita/centroReceita.service';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { Permissao } from 'src/app/_models/Permissoes/permissao';

@Component({
  selector: 'app-centro-receita',
  templateUrl: './centroReceita.component.html'
})
export class CentroReceitaComponent implements OnInit, AfterViewChecked, AfterViewInit {

  novo = true;
  editar = true;
  visualizar = true;

  cadastroForm: FormGroup;

  centrosReceita: CentroReceita[];

  centroReceita: CentroReceita;

  paginaAtual = 1;
  totalRegistros = 0; number;

  modo = '';

  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private router: Router,
              private centroReceitaService: CentroReceitaService,
              private permissaoService: PermissaoService,
              private changeDetectionRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.getCentroReceita();
    this.validarForm();
  }

  ngAfterViewInit() {
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('CENTRO DE RECEITA', 'NOVO').subscribe((_PERMISSAO: Permissao) => {
      this.novo = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('CENTRO DE RECEITA', 'EDITAR').subscribe((_PERMISSAO: Permissao) => {
      this.editar = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('CENTRO DE RECEITA', 'VISUALIZAR').subscribe((_PERMISSAO: Permissao) => {
      this.visualizar = this.permissaoService.verificarPermissao(_PERMISSAO);
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
    if (modo === 'NOVO') {
      this.cadastroForm.reset();
    } else if (modo === 'EDITAR') {
      this.carregarCentroReceita(centroReceita);
    }
    template.show();
  }

  cadastrarCentroReceita(template: any) {
    this.centroReceita = Object.assign(this.cadastroForm.value, {id: 0});
    console.log(this.centroReceita);
    this.centroReceitaService.novoCentroReceita(this.centroReceita).subscribe(
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
    this.centroReceitaService.getAllCentroReceita().subscribe(
      (_CENTROS: CentroReceita[]) => {
      this.centrosReceita = _CENTROS;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Centros de Receita: ${error.error}`);
    });
  }

}
