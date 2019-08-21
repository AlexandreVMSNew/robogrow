import { Component, OnInit, AfterViewChecked, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CentroDespesa } from 'src/app/_models/Cadastros/CentroDespesa/centroDespesa';
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
  totalRegistros: number;

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
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('CENTRO DE DESPESA', 'NOVO').subscribe((_PERMISSAO: Permissao) => {
      this.novo = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('CENTRO DE DESPESA', 'EDITAR').subscribe((_PERMISSAO: Permissao) => {
      this.editar = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('CENTRO DE DESPESA', 'VISUALIZAR').subscribe((_PERMISSAO: Permissao) => {
      this.visualizar = this.permissaoService.verificarPermissao(_PERMISSAO);
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
    this.centroDespesaService.getAllCentroDespesa().subscribe(
      (_CENTROS: CentroDespesa[]) => {
      this.centrosDespesa = _CENTROS;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Centros de Despesa: ${error.error}`);
    });
  }

}
