import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { Venda } from 'src/app/_models/Movimentos/Venda/Venda';
import { VendaService } from 'src/app/_services/Movimentos/Venda/venda.service';
import { Permissao } from 'src/app/_models/Permissoes/permissao';
import { EditarClienteComponent } from 'src/app/cadastros/cliente/editarCliente/editarCliente.component';
import { TemplateModalService } from 'src/app/_services/Uteis/TemplateModal/templateModal.service';
import { SpinnerService } from 'src/app/_services/Uteis/Spinner/spinner.service';
import { PermissaoObjetos } from 'src/app/_models/Permissoes/permissaoObjetos';
import { ConfigVendaComponent } from './configVenda/configVenda.component';
import { VendaStatus } from 'src/app/_models/Movimentos/Venda/VendaStatus';
@Component({
  selector: 'app-venda',
  templateUrl: './venda.component.html',
  styles: [
  `:host >>> .popover {
      max-width: 100% !important;
    }
    :host >>> .popover>.arrow:after {
      max-width: 100% !important;
    }`
  ]
})
export class VendaComponent implements OnInit, AfterViewInit {

  formularioComponent = 'VENDAS';
  cadastrar = false;
  editar = false;
  listar = false;
  visualizar = false;
  excluir = false;

  editarConfig = false;
  visualizarConfig = false;

  vendas: Venda[];
  vendasFiltro: Venda[];

  vendaStatus: VendaStatus[] = [];
  vendaStatusIdFiltroSelecionado = 0;

  filtrarPor = ['NOME FANTASIA', 'RAZÃO SOCIAL', 'N° VENDA'];
  filtroSelecionado = 'NOME FANTASIA';

  filtroTextoAux: string;

  paginaAtual = 1;
  totalRegistros = 0; number;

  templateModalClienteService = new TemplateModalService();
  editarClienteComponent = EditarClienteComponent;

  templateModalVendaConfigService = new TemplateModalService();
  vendaConfigComponent = ConfigVendaComponent;

  inputs: any;
  componentModal: any;

  constructor(private toastr: ToastrService,
              private spinnerService: SpinnerService,
              private permissaoService: PermissaoService,
              private vendaService: VendaService) { }

  ngOnInit() {
    this.getVendas();
    this.getVendaStatus();
  }

  ngAfterViewInit() {
    this.spinnerService.alterarSpinnerStatus(true);
    this.permissaoService.getPermissaoObjetosByFormularioAndNivelId(Object.assign({ formulario: this.formularioComponent }))
    .subscribe((permissaoObjetos: PermissaoObjetos[]) => {
      const permissaoFormulario = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'FORMULÁRIO');
      this.cadastrar = (permissaoFormulario !== null ) ? permissaoFormulario.cadastrar : false;
      this.editar = (permissaoFormulario !== null ) ? permissaoFormulario.editar : false;
      this.listar = (permissaoFormulario !== null ) ? permissaoFormulario.listar : false;
      this.visualizar = (permissaoFormulario !== null ) ? permissaoFormulario.visualizar : false;
      this.excluir = (permissaoFormulario !== null ) ? permissaoFormulario.excluir : false;

      const permissaoConfig = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'CONFIGURAÇÕES');
      this.editarConfig = (permissaoConfig !== null ) ? permissaoConfig.editar : false;
      this.visualizarConfig = (permissaoConfig !== null ) ? permissaoConfig.visualizar : false;
      this.spinnerService.alterarSpinnerStatus(false);
    }, error => {
      this.spinnerService.alterarSpinnerStatus(false);
      console.log(error.error);
    });
  }

  get filtroTexto(): string {
    return this.filtroTextoAux;
  }

  set filtroTexto(value: string) {
    this.filtroTextoAux = value;
  }

  setFiltroSelecionado(valor: any) {
    this.filtroSelecionado = valor;
  }

  filtrarVendas(filtrarPor: string): Venda[] {
    let filtroRetorno: Venda[] = [];
    if (this.vendaStatusIdFiltroSelecionado !== 0) {
      filtroRetorno = this.vendas.filter(_VENDA => _VENDA.vendaStatusId === this.vendaStatusIdFiltroSelecionado);
    } else {
      filtroRetorno = this.vendas;
    }

    if (filtrarPor) {
      if (this.filtroSelecionado === 'N° VENDA') {
        filtroRetorno = filtroRetorno
                        .filter(venda => venda.numeroAno.toLocaleUpperCase().indexOf(filtrarPor.toLocaleUpperCase()) !== -1);
      } else if (this.filtroSelecionado === 'RAZÃO SOCIAL') {
        filtroRetorno = filtroRetorno
                        .filter(venda => venda.clientes.razaoSocial.toLocaleUpperCase().indexOf(filtrarPor.toLocaleUpperCase()) !== -1);
      } else if (this.filtroSelecionado === 'NOME FANTASIA') {
        filtroRetorno = filtroRetorno
                        .filter(venda => venda.clientes.nomeFantasia.toLocaleUpperCase().indexOf(filtrarPor.toLocaleUpperCase()) !== -1);
      }
    }
    this.totalRegistros = filtroRetorno.length;
    return filtroRetorno;
  }

  pesquisarVendas() {
    this.getVendas();
  }

  getVendas() {
    this.spinnerService.alterarSpinnerStatus(true);
    this.vendaService.getVenda().subscribe(
      (_VENDAS: Venda[]) => {
      this.vendas = _VENDAS;
      this.vendasFiltro = this.filtrarVendas(this.filtroTexto);
      this.spinnerService.alterarSpinnerStatus(false);
    }, error => {
      this.spinnerService.alterarSpinnerStatus(false);
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar VendaS: ${error.error}`);
    });
  }

  getVendaStatus() {
    this.vendaService.getVendaStatus().subscribe(
      (_STATUS: VendaStatus[]) => {
      this.vendaStatus = _STATUS;
      this.vendaStatus.push(Object.assign({id: 0, descricao: 'TODOS'}));
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Vendas Status: ${error.error}`);
    });
  }

  abrirTemplateModalCliente(component, clienteId: number) {
    this.componentModal = component;
    this.inputs = Object.assign({idCliente: clienteId});
    this.templateModalClienteService.setTemplateModalStatus(true);
  }

  getTemplateModalCliente() {
    return this.templateModalClienteService.getTemplateModalStatus();
  }

  getTemplateModalVendaConfig() {
    return this.templateModalVendaConfigService.getTemplateModalStatus();
  }

  abrirTemplateModalVendaConfig() {
    this.componentModal = this.vendaConfigComponent;
    this.inputs = null;
    this.templateModalVendaConfigService.setTemplateModalStatus(true);
  }

}
