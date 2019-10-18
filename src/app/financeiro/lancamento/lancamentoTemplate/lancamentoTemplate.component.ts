import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Lancamentos } from 'src/app/_models/Movimentos/Lancamentos/Lancamentos';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { PlanoContas } from 'src/app/_models/Cadastros/PlanoContas/planoContas';
import { ToastrService } from 'ngx-toastr';
import { PlanoContaService } from 'src/app/_services/Cadastros/PlanosConta/planoConta.service';
import { DataService } from 'src/app/_services/Cadastros/Uteis/data.service';
import { LancamentoService } from 'src/app/_services/Movimentos/Lancamentos/lancamento.service';
import * as moment from 'moment';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { Permissao } from 'src/app/_models/Permissoes/permissao';

@Component({
  selector: 'app-lancamento-templante',
  templateUrl: './lancamentoTemplate.component.html',
  styleUrls: ['./lancamentoTemplate.component.css']
})
export class LancamentoTemplateComponent implements OnInit, AfterViewInit {
  @Input() idLancamento: number;

  novo = false;
  editar = false;

  cadastroLancamento: FormGroup;

  lancamento: Lancamentos;

  planoContas: PlanoContas[];
  contaDebitoIdSelecionado: any;
  contaCreditoIdSelecionado: any;

  templateEnabled = false;
  idUsuario: number;

  bsConfig: Partial<BsDatepickerConfig> = Object.assign({}, { containerClass: 'theme-dark-blue' });
  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private planoContaService: PlanoContaService,
              private permissaoService: PermissaoService,
              public dataService: DataService,
              private lancamentoService: LancamentoService) {}

  ngOnInit() {
    this.idUsuario = this.permissaoService.getUsuarioId();
    this.validarLancamentos();
    this.getPlanoContas();
    if (this.idLancamento !== 0) {
      this.carregarLancamento();
    }
  }

  ngAfterViewInit() {
    this.permissaoService.getPermissoesByFormulario(
      Object.assign({formulario: 'LANÇAMENTO'})).subscribe((_PERMISSOES: Permissao[]) => {
      this.novo = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'NOVO')[0]);
      this.editar = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'EDITAR')[0]);
    });
  }

  carregarLancamento() {
    this.lancamento = null;
    this.lancamentoService.getLancamentoById(this.idLancamento)
      .subscribe(
        (_LANCAMENTO: Lancamentos) => {
          this.lancamento = Object.assign(_LANCAMENTO, {
            dataLancamento: this.dataService.getDataPTBR(_LANCAMENTO.dataLancamento)
          });

          this.cadastroLancamento.patchValue(this.lancamento);

          console.log(this.lancamento);

        }, error => {
          this.toastr.error(`Erro ao tentar carregar Lancamento: ${error.error}`);
          console.log(error);
        });
  }

  validarLancamentos() {
    this.cadastroLancamento = this.fb.group({
        id:  [''],
        centroDespesaId: [''],
        centroReceitaId: [''],
        descricao: ['', Validators.required],
        planoDebitoId: ['', Validators.required],
        planoCreditoId: ['', Validators.required],
        valor: ['', [Validators.required, Validators.min(1)]],
        usuarioId: [''],
        dataHora: [''],
        dataLancamento: ['', Validators.required]
    });
  }

  salvarLancamento(template: any) {
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    const dataLanc = moment(this.cadastroLancamento.get('dataLancamento').value, 'DD/MM/YYYY').format('YYYY-MM-DD');
    if (this.idLancamento === 0) {
      this.lancamento = Object.assign(this.cadastroLancamento.value, {id: 0, dataHora: dataAtual,
        dataLancamento: dataLanc,
        usuarioId: this.idUsuario});
      this.lancamentoService.novoLancamento(this.lancamento).subscribe(
        () => {
          this.fecharTemplate(template);
          this.toastr.success(`Cadastrado com Sucesso!`);
        }, error => {
          console.log(error.error);
        });
    } else {
      this.lancamento = Object.assign(this.cadastroLancamento.value, {
        dataLancamento: dataLanc});
      this.lancamentoService.editarLancamento(this.lancamento).subscribe(
        () => {
          this.toastr.success(`Editado com Sucesso!`);
        }, error => {
          console.log(error.error);
        }
      );
    }
  }

  abrirTemplate(template: any) {
    if (this.templateEnabled === false) {
      template.show();
      this.templateEnabled = true;
    }
  }

  fecharTemplate(template: any) {
    template.hide();
    this.lancamentoService.setLancamentoTemplateStatus(false);
  }

  getPlanoContas() {
    this.planoContaService.getPlanosConta().subscribe(
      (_PLANOS: PlanoContas[]) => {
      this.planoContas = _PLANOS.filter(c => c.categoria === 'ANALÍTICA');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Planos de Contas: ${error.error}`);
    });
  }


}
