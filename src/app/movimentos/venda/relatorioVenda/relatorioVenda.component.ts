import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { VendaService } from 'src/app/_services/Movimentos/Venda/venda.service';
import { DataPeriodo } from 'src/app/_models/Cadastros/Uteis/DataPeriodo';
import { DataService } from 'src/app/_services/Cadastros/Uteis/data.service';
import * as moment from 'moment';
import { RelatorioVendas } from 'src/app/_models/Movimentos/RelatorioVendas/RelatorioVendas';
import { RelatorioGraficoResultadoPorMes } from 'src/app/_models/Movimentos/RelatorioVendas/RelatorioGraficoResultadoPorMes';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { EditarClienteComponent } from 'src/app/cadastros/cliente/editarCliente/editarCliente.component';
import { TemplateModalService } from 'src/app/_services/Uteis/TemplateModal/templateModal.service';
import { SpinnerService } from 'src/app/_services/Uteis/Spinner/spinner.service';

@Component({
  selector: 'app-relatorio-venda',
  templateUrl: './relatorioVenda.component.html',
  styleUrls: ['./relatorioVenda.component.css']
})

export class RelatorioVendaComponent implements OnInit, AfterViewInit {

  visualizarRelatorio = false;

  dataPeriodo: DataPeriodo;

  relatorioVendas: RelatorioVendas = null;

  barChartData: ChartDataSets[];
  barChartLabels: Label[];

  editarClienteComponent = EditarClienteComponent;
  inputs: any;
  componentModal: any;

  constructor(private toastr: ToastrService,
              private spinnerService: SpinnerService,
              public permissaoService: PermissaoService,
              private dataService: DataService,
              private templateModalService: TemplateModalService,
              public vendaService: VendaService) { }

  ngOnInit() {
    this.dataPeriodo = Object.assign(
      {
        dataInicial: this.dataService.getDataSQL('01/01/' + new Date().getFullYear().toString()) + 'T00:00:00',
        startDate: '01/01/' + new Date().getFullYear().toString(),
        dataFinal: this.dataService.getDataSQL('31/12/' + new Date().getFullYear().toString()) + 'T23:59:00',
        endDate: '31/12/' + new Date().getFullYear().toString(),
      }
    );
    this.getVendas(this.dataPeriodo);
  }

  ngAfterViewInit() {

  }

  carregarInformacoes() {
    this.barChartData = [];
    this.barChartLabels = [];
    const barChartArrayReceitas = [];
    const barChartArrayDespesas = [];

    if (this.relatorioVendas.graficoResultadoPorMes) {
      this.relatorioVendas.graficoResultadoPorMes.forEach((resultadoMes: RelatorioGraficoResultadoPorMes) => {
        this.barChartLabels.push(resultadoMes.mes);
        barChartArrayReceitas.push(resultadoMes.valorReceitas);
        barChartArrayDespesas.push(resultadoMes.valorDespesas);
      });
    }

    this.barChartData =  [
      { data: barChartArrayReceitas, label: 'Receitas', backgroundColor: 'rgba(0,192,239,1)', hoverBackgroundColor: 'rgba(0,192,239,1)',
        borderColor: 'rgba(0,192,239,1)'},
      { data: barChartArrayDespesas, label: 'Despesas', backgroundColor: 'rgba(221,75,57,1)', hoverBackgroundColor: 'rgba(221,75,57,1)',
        borderColor: 'rgba(221,75,57,1)'}
    ];
    this.spinnerService.alterarSpinnerStatus(false);
  }

  abrirTemplateModal(component, clienteId: number) {
    this.componentModal = component;
    this.inputs = Object.assign({idCliente: clienteId});
    this.templateModalService.setTemplateModalStatus(true);
  }

  getTemplateModal() {
    return this.templateModalService.getTemplateModalStatus();
  }

  setDataFiltro(valor: any) {
    const dataStart = (valor.dataInicial) ? valor.dataInicial : valor.dataInicial;
    const dataEnd = (valor.dataFinal) ? valor.dataFinal : valor.dataFinal;
    this.dataPeriodo = Object.assign(
      {
        dataInicial: dataStart,
        dataFinal: dataEnd
      }
    );
  }

  getVendas(dataPeriodo: DataPeriodo) {
    this.spinnerService.alterarSpinnerStatus(true);
    this.vendaService.getVendaRelatorio(dataPeriodo).subscribe(
      (relatorioVendas: RelatorioVendas) => {
      this.relatorioVendas = relatorioVendas;
      this.carregarInformacoes();
    }, error => {
      this.spinnerService.alterarSpinnerStatus(false);
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar VendaS: ${error.error}`);
    });
}

}
