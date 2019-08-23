import { Component, OnInit, Input } from '@angular/core';
import { PlanoPagamento } from 'src/app/_models/Cadastros/PlanoPagamento/PlanoPagamento';
import { PlanoPagamentoService } from 'src/app/_services/Cadastros/PlanoPagamento/planoPagamento.service';
import { PlanoContaService } from 'src/app/_services/Cadastros/PlanosConta/planoConta.service';
import { PlanoContas } from 'src/app/_models/Cadastros/PlanoContas/planoContas';
import { ToastrService } from 'ngx-toastr';
import { VendaService } from 'src/app/_services/Movimentos/Venda/venda.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { VendaConfig } from 'src/app/_models/Movimentos/Venda/VendaConfig';

@Component({
  selector: 'app-config-venda',
  templateUrl: './configVenda.component.html',
  styleUrls: ['./configVenda.component.css']
})

export class ConfigVendaComponent implements OnInit {

  cadastroVendaConfig: FormGroup;

  vendaConfig: VendaConfig;
  planosPagamento: PlanoPagamento[];
  planoPagamentoIdSelecionado: number;

  planoContas: PlanoContas[];
  planoContaRecebIdSelecionado: number;
  planoContaPagIdSelecionado: number;

  templateEnabled = false;

  idVendaConfig = 0;

  constructor(private planoPagamentoService: PlanoPagamentoService,
              private planoContaService: PlanoContaService,
              private vendaService: VendaService,
              private toastr: ToastrService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.getPlanoContas();
    this.getPlanoPagamento();
    this.validarRecebimentos();
    this.carregarConfigVenda();
  }

  carregarConfigVenda() {
    this.vendaService.getVendaConfig()
      .subscribe(
        (_CONFIG: VendaConfig) => {
          this.vendaConfig = Object.assign({}, _CONFIG);
          this.idVendaConfig = this.vendaConfig.id;

          this.cadastroVendaConfig.patchValue(this.vendaConfig);

          this.planoPagamentoIdSelecionado = this.vendaConfig.planoPagamentoSaidasId;
          this.planoContaRecebIdSelecionado = this.vendaConfig.planoContaRecebParcelaAVistaId;
          this.planoContaPagIdSelecionado = this.vendaConfig.planoContaPagParcelaAVistaId;
        }, error => {
          this.toastr.error(`Erro ao tentar carregar Venda: ${error.error}`);
          console.log(error);
        });
  }

  validarRecebimentos() {
    this.cadastroVendaConfig = this.fb.group({
        id:  [''],
        planoContaRecebParcelaAVistaId: ['', Validators.required],
        planoContaPagParcelaAVistaId: ['', Validators.required],
        planoPagamentoSaidasId: ['', Validators.required]
    });
  }

  salvarAlteracao() {
    if (this.idVendaConfig === 0) {
      const vendaConfig = Object.assign(this.cadastroVendaConfig.value, {id: 0});
      this.vendaService.novoVendaConfig(vendaConfig).subscribe((_CONFIG: VendaConfig[]) => {
          this.vendaConfig = Object.assign({}, _CONFIG[0]);
          this.toastr.success('Salvo com Sucesso!');
      }, error => {
        console.log(error.error);
        this.toastr.error(`Erro ao tentar inserir nova venda config : ${error.error}`);
      });
    } else {
      const vendaConfig = Object.assign(this.cadastroVendaConfig.value);
      console.log(vendaConfig);
      this.vendaService.editarVendaConfig(vendaConfig).subscribe((_CONFIG: VendaConfig[]) => {
          this.vendaConfig = Object.assign({}, _CONFIG[0]);
          this.toastr.success('Salvo com Sucesso!');
      }, error => {
        console.log(error.error);
        this.toastr.error(`Erro ao tentar inserir nova venda config : ${error.error}`);
      });
    }
  }

  getPlanoContas() {
    this.planoContaService.getAllPlanosConta().subscribe(
      (_PLANOS: PlanoContas[]) => {
      this.planoContas = _PLANOS.filter(c => c.tipo === 'MOVIMENTO' && c.categoria === 'ANALÍTICA');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Planos de Contas: ${error.error}`);
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

  abrirTemplate(template: any) {
    if (this.templateEnabled === false) {
      this.templateEnabled = true;
      template.show();
    }
  }

  fecharTemplate(template: any) {
    template.hide();
    this.vendaService.setConfigVendaStatus(false);
    this.templateEnabled = false;
  }
}