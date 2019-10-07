import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BsLocaleService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { Venda } from 'src/app/_models/Movimentos/Venda/Venda';
import { FormGroup } from '@angular/forms';
import { VendaService } from 'src/app/_services/Movimentos/Venda/venda.service';
import { Permissao } from 'src/app/_models/Permissoes/permissao';

@Component({
  selector: 'app-venda',
  templateUrl: './venda.component.html'
})
export class VendaComponent implements OnInit, AfterViewInit {

  novo = false;
  editar = false;
  excluir = false;
  visualizar = false;

  vendas: Venda[];
  vendasFiltro: Venda[];

  status = ['EM NEGOCIAÇÃO', 'EM IMPLANTAÇÃO', 'IMPLANTADO', 'FINALIZADO', 'DISTRATADO', 'TODOS'];
  statusFiltroSelecionado = 'TODOS';

  filtrarPor = ['NOME FANTASIA', 'RAZÃO SOCIAL', 'N° VENDA'];
  filtroSelecionado = 'NOME FANTASIA';

  filtroTextoAux: string;

  paginaAtual = 1;
  totalRegistros = 0; number;

  constructor(private toastr: ToastrService,
              public permissaoService: PermissaoService,
              public vendaService: VendaService) { }

  ngOnInit() {
    this.getVendas();
  }

  ngAfterViewInit() {
    this.permissaoService.getPermissoesByFormulario(
      Object.assign({formulario: 'VENDA'})).subscribe((_PERMISSOES: Permissao[]) => {
      this.novo = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'NOVO')[0]);
      this.editar = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'EDITAR')[0]);
      this.visualizar = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'VISUALIZAR')[0]);
    });
  }

  get filtroTexto(): string {
    return this.filtroTextoAux;
  }

  set filtroTexto(value: string) {
    this.filtroTextoAux = value;
    this.vendasFiltro = this.filtrarVendas(this.filtroTextoAux);
  }

  setFiltroSelecionado(valor: any) {
    this.filtroSelecionado = valor;
  }

  setStatusFiltroSelecionado(valor: any) {
    this.statusFiltroSelecionado = valor;
    this.vendasFiltro = this.filtrarVendas(this.filtroTexto);
  }

  filtrarVendas(filtrarPor: string): Venda[] {
    let filtroRetorno: Venda[] = [];
    if (this.statusFiltroSelecionado !== 'TODOS') {
      filtroRetorno = this.vendas.filter(_CLIENTE => _CLIENTE.status === this.statusFiltroSelecionado);
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

  getVendas() {
    this.vendaService.getAllVenda().subscribe(
      (_VENDAS: Venda[]) => {
      this.vendas = _VENDAS;
      this.vendasFiltro = this.filtrarVendas(this.filtroTexto);
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar VendaS: ${error.error}`);
    });
  }

  getVendaConfig() {
    return this.vendaService.getConfigVendaStatus();
  }

  abrirVendaConfig() {
    this.vendaService.setConfigVendaStatus(true);
  }

}
