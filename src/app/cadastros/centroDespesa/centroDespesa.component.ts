import { Component, OnInit, AfterViewChecked, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CentroDespesa } from 'src/app/_models/Cadastros/CentroDespesa/CentroDespesa';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CentroDespesaService } from 'src/app/_services/Cadastros/CentroDespesa/centroDespesa.service';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { Permissao } from 'src/app/_models/Permissoes/permissao';

@Component({
  selector: 'app-centro-despesa',
  templateUrl: './centroDespesa.component.html'
})
export class CentroDespesaComponent implements OnInit, AfterViewChecked, AfterViewInit {

  novo = true;
  editar = true;
  visualizar = true;

  cadastroForm: FormGroup;

  centrosDespesa: CentroDespesa[];

  centroDespesa: CentroDespesa;

  paginaAtual = 1;
  totalRegistros = 0; number;

  modo = '';

  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private router: Router,
              private centroDespesaService: CentroDespesaService,
              private permissaoService: PermissaoService,
              private changeDetectionRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.getCentroDespesa();
    this.validarForm();
  }

  ngAfterViewInit() {
    this.permissaoService.getPermissoesByFormulario(
      Object.assign({formulario: 'CENTRO DE DESPESA'})).subscribe((_PERMISSOES: Permissao[]) => {
      this.novo = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'NOVO')[0]);
      this.editar = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'EDITAR')[0]);
      this.visualizar = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'VISUALIZAR')[0]);
    });
  }

  ngAfterViewChecked() {
    this.changeDetectionRef.detectChanges();
  }

  carregarCentroDespesa(centroDespesa: CentroDespesa) {
    this.centroDespesa = Object.assign({}, centroDespesa);
    this.cadastroForm.patchValue(this.centroDespesa);
  }

  validarForm() {
    this.cadastroForm = this.fb.group({
        id:  [''],
        descricao: ['', Validators.required],
        status: ['', Validators.required]
    });
  }

  abrirTemplateCentroDespesa(modo: string, centroDespesa: CentroDespesa, template: any) {
    this.modo = modo;
    if (modo === 'NOVO') {
      this.cadastroForm.reset();
    } else if (modo === 'EDITAR') {
      this.carregarCentroDespesa(centroDespesa);
    }
    template.show();
  }

  cadastrarCentroDespesa(template: any) {
    this.centroDespesa = Object.assign(this.cadastroForm.value, {id: 0});

    this.centroDespesaService.novoCentroDespesa(this.centroDespesa).subscribe(
      () => {
        this.getCentroDespesa();
        template.hide();
        this.toastr.success(`Cadastrado com Sucesso!`);
      }, error => {
        console.log(error.error);
      });
  }

  salvarCentroDespesa(template: any) {
    this.centroDespesa = Object.assign(this.cadastroForm.value);
    this.centroDespesaService.editarCentroDespesa(this.centroDespesa).subscribe(
      () => {
        this.getCentroDespesa();
        template.hide();
        this.toastr.success(`Editado com Sucesso!`);
      }, error => {
        console.log(error.error);
      }
    );
  }

  getCentroDespesa() {
    this.centroDespesaService.getCentroDespesa().subscribe(
      (_CENTROS: CentroDespesa[]) => {
      this.centrosDespesa = _CENTROS;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Centros de Despesa: ${error.error}`);
    });
  }

}
