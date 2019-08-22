import { Component, OnInit, AfterViewChecked, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { PlanoContas } from 'src/app/_models/Cadastros/PlanoContas/planoContas';
import { PlanoContaService } from 'src/app/_services/Cadastros/PlanosConta/planoConta.service';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { Permissao } from 'src/app/_models/Permissoes/permissao';

@Component({
  selector: 'app-plano-conta',
  templateUrl: './planoConta.component.html'
})
export class PlanoContaComponent implements OnInit, AfterViewChecked, AfterViewInit {

  novo = true;
  editar = true;
  visualizar = true;

  cadastroForm: FormGroup;

  planoContas: PlanoContas[];

  planoConta: PlanoContas;
  planoContaIdSuperiorSelecionado = 0;

  paginaAtual = 1;
  totalRegistros: number;

  disabledTipo = false;
  modo = '';

  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private router: Router,
              private permissaoService: PermissaoService,
              private planoContaService: PlanoContaService,
              private changeDetectionRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.getPlanoContas();
    this.validarForm();
  }

  ngAfterViewInit() {
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('PLANO DE CONTAS', 'NOVO').subscribe((_PERMISSAO: Permissao) => {
      this.novo = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('PLANO DE CONTAS', 'EDITAR').subscribe((_PERMISSAO: Permissao) => {
      this.editar = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('PLANO DE CONTAS', 'VISUALIZAR').subscribe((_PERMISSAO: Permissao) => {
      this.visualizar = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
  }

  ngAfterViewChecked() {
    this.changeDetectionRef.detectChanges();
  }

  carregarPlanoConta(planoConta: PlanoContas) {
    this.planoConta = Object.assign({}, planoConta);
    this.cadastroForm.patchValue(this.planoConta);
    this.setTipoConta(this.planoConta);
  }

  validarForm() {
    this.cadastroForm = this.fb.group({
        id:  [''],
        descricao: ['', Validators.required],
        tipo: ['', Validators.required],
        categoria: ['', Validators.required],
        nivel: [''],
        planoContasId: [''],
        status: ['', Validators.required]
    });
  }

  abrirTemplatePlanoConta(modo: string, planoConta: PlanoContas, template: any) {
    this.planoContaIdSuperiorSelecionado = 0;
    this.modo = modo;
    if (modo === 'NOVO') {
      this.validarForm();
    } else if (modo === 'EDITAR') {
      this.carregarPlanoConta(planoConta);
    }
    template.show();
  }

  setTipoConta(contaSelecionada: any) {
    if (contaSelecionada) {
      this.cadastroForm.get('tipo').setValue(contaSelecionada.tipo);
    } else {
      this.cadastroForm.get('tipo').setValue(null);
    }
  }

  criarNivel(_PLANOFILHOS: any, raiz: boolean): string {
    let qtdFilhos = 0;
    const nivelPai = _PLANOFILHOS.nivel;
    if (raiz === false) {
      qtdFilhos = _PLANOFILHOS.planoConta.length;
      const nivelFilho = qtdFilhos + 1;
      if (nivelPai.length === 7) {
        return nivelPai + '.' + ('00' + nivelFilho).slice(-2);
      } else if (nivelPai.length === 8) {
        return nivelPai + '.' + ('0000' + nivelFilho).slice(-4);
      } else {
        return nivelPai + '.' + nivelFilho;
      }
    } else {
      qtdFilhos = _PLANOFILHOS.filter(c => c.planosContaId === null).length;
      qtdFilhos = qtdFilhos + 1;
      const nivelFilho = qtdFilhos;
      return nivelFilho.toString();
    }
  }

  cadastrarPlanoConta(template: any) {
    let nivelFilho = '';
    if (!this.planoContaIdSuperiorSelecionado) {
      this.planoContaIdSuperiorSelecionado = 0;
    }
    this.planoContaService.getPlanoContasFilhosById(this.planoContaIdSuperiorSelecionado).subscribe(
      (_PLANOFILHOS: PlanoContas) => {
      if (_PLANOFILHOS) {
        nivelFilho = this.criarNivel(_PLANOFILHOS, false);
      } else {
        nivelFilho = this.criarNivel(this.planoContas, true);
        this.planoContaIdSuperiorSelecionado = null;
      }
      this.planoConta = Object.assign(this.cadastroForm.value,
        {id: 0, nivel: nivelFilho, planoContasId: this.planoContaIdSuperiorSelecionado});

      this.planoContaService.novoPlanoConta(this.planoConta).subscribe(
        () => {
          this.getPlanoContas();
          template.hide();
          this.toastr.success(`Cadastrado com Sucesso!`);
        }, error => {
          console.log(error.error);
        }
      );

    });
  }

  salvarPlanoConta(template: any) {
    this.planoConta = Object.assign(this.cadastroForm.value,
      {tipo: this.cadastroForm.get('tipo').value, planosContaId: this.planoContaIdSuperiorSelecionado});
    this.planoContaService.editarPlanoConta(this.planoConta).subscribe(
      () => {
        this.getPlanoContas();
        template.hide();
        this.toastr.success(`Editado com Sucesso!`);
      }, error => {
        console.log(error.error);
      }
    );
  }

  getPlanoContas() {
    this.planoContaService.getAllPlanosConta().subscribe(
      (_PLANOS: PlanoContas[]) => {
      this.planoContas = _PLANOS;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Planos de Contas: ${error.error}`);
    });
  }

}
