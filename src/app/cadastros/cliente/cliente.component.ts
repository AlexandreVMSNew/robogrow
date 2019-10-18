import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Cliente } from '../../_models/Cadastros/Clientes/Cliente';
import { FormGroup } from '@angular/forms';
import { ClienteService } from '../../_services/Cadastros/Clientes/cliente.service';
import { BsLocaleService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Estado } from '../../_models/Cadastros/Uteis/Estado';
import { Cidade } from '../../_models/Cadastros/Uteis/Cidade';
import { CidadeService } from '../../_services/Cadastros/Uteis/cidade.service';
import { EstadoService } from '../../_services/Cadastros/Uteis/estado.service';
import { PermissaoService } from '../../_services/Permissoes/permissao.service';
import { Permissao } from '../../_models/Permissoes/permissao';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html'
})
export class ClienteComponent implements OnInit, AfterViewInit {

  novo = false;
  editar = false;
  excluir = false;
  visualizar = false;

  clientesFiltro: Cliente[];
  cliente: Cliente;
  clientes: Cliente[];

  modoSalvar = '';
  cadastroForm: FormGroup;
  bodyExcluirCliente = '';

  paginaAtual = 1;
  totalRegistros = 0;

  status = ['ATIVO', 'INATIVO', 'PROSPECT', 'TODOS'];
  statusFiltroSelecionado = 'ATIVO';

  filtrarPor = ['COD.SIGA', 'RAZÃO SOCIAL', 'NOME FANTASIA', 'CNPJ/CPF', 'CIDADE'];
  filtroSelecionado = 'NOME FANTASIA';

  cidades: Cidade[];
  cidadeIdSelecionado: any;

  estados: Estado[];
  estadoIdSelecionado: any;

  filtroTextoAux: string;

  valueCnpjCpfPipe = '';

  constructor(
    private clienteService: ClienteService,
    private cidadeService: CidadeService,
    private estadoService: EstadoService,
    private localeService: BsLocaleService,
    private toastr: ToastrService,
    public permissaoService: PermissaoService
    ) {
      this.localeService.use('pt-br');
    }

  ngOnInit() {
    this.getEstados();
    this.estadoIdSelecionado = 11;
    this.getCidades(this.estadoIdSelecionado);
    this.getClientes();
  }

  ngAfterViewInit() {
    this.permissaoService.getPermissoesByFormulario(
      Object.assign({formulario: 'CLIENTES'})).subscribe((_PERMISSOES: Permissao[]) => {
      this.novo = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'NOVO')[0]);
      this.editar = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'EDITAR')[0]);
      this.excluir = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'EXCLUIR')[0]);
      this.visualizar = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'VISUALIZAR')[0]);
    });
  }

  excluirCliente(cliente: Cliente, template: any) {
    this.cliente = cliente;
    this.bodyExcluirCliente = `Tem certeza que deseja excluir o Cliente: ${cliente.nomeFantasia}, Código: ${cliente.id}?`;
    template.show();
  }

  confirmarExclusao(template: any) {
    this.clienteService.excluirCliente(this.cliente.id).subscribe(
    () => {
        template.hide();
        this.getClientes();
        this.toastr.success('Excluído com sucesso!');
      }, error => {
        this.toastr.error(`Erro ao tentar Excluir: ${error}`);
      });
  }

  get filtroTexto(): string {
    return this.filtroTextoAux;
  }

  set filtroTexto(value: string) {
    this.filtroTextoAux = value;
    this.clientesFiltro = this.filtrarClientes(this.filtroTextoAux);
  }

  setFiltroSelecionado(valor: any) {
    this.filtroSelecionado = valor;
  }

  setStatusFiltroSelecionado(valor: any) {
    this.statusFiltroSelecionado = valor;
    this.clientesFiltro = this.filtrarClientes(this.filtroTexto);
  }

  filtrarClientes(filtro: string): Cliente[] {
    let filtroRetorno: Cliente[] = [];

    if (this.statusFiltroSelecionado !== 'TODOS') {
      filtroRetorno = this.clientes.filter(_CLIENTE => _CLIENTE.status === this.statusFiltroSelecionado);
    } else {
      filtroRetorno = this.clientes;
    }

    if (filtro) {
      if (this.filtroSelecionado === 'COD.SIGA') {
        filtroRetorno = filtroRetorno
                            .filter(cliente => cliente.codSiga.toLocaleUpperCase().indexOf(filtro.toLocaleUpperCase()) !== -1);
      } else if (this.filtroSelecionado === 'RAZÃO SOCIAL') {
        filtroRetorno = filtroRetorno
                            .filter(cliente => cliente.razaoSocial.toLocaleUpperCase().indexOf(filtro.toLocaleUpperCase()) !== -1);
      } else if (this.filtroSelecionado === 'NOME FANTASIA') {
        filtroRetorno = filtroRetorno
                            .filter(cliente => cliente.nomeFantasia.toLocaleUpperCase().indexOf(filtro.toLocaleUpperCase()) !== -1);
      } else if (this.filtroSelecionado === 'CNPJ/CPF') {
        filtroRetorno = filtroRetorno
                            .filter(cliente => cliente.cnpjCpf.toLocaleUpperCase().indexOf(filtro.toLocaleUpperCase()) !== -1);
      } else if (this.filtroSelecionado === 'CIDADE') {
        filtroRetorno = filtroRetorno
                            .filter(cliente => cliente.cidadeId === Number(filtro));
      }
    }

    this.totalRegistros = filtroRetorno.length;
    return filtroRetorno;
  }

  getClientes() {
    this.clienteService.getCliente().subscribe(
      (_CLIENTES: Cliente[]) => {
      this.clientes = _CLIENTES;
      this.clientesFiltro = this.filtrarClientes(this.filtroTexto);
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar clientes: ${error.error}`);
    });
  }

  getEstados() {
    this.estadoService.getEstados().subscribe(
      (_ESTADOS: Estado[]) => {
      this.estados = _ESTADOS;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar estados: ${error.error}`);
    });
  }

  getCidades(EstadoId: number) {
    if (EstadoId != null) {
    this.cidadeService.getCidadeByEstadoId(EstadoId).subscribe(
      (_CIDADES: Cidade[]) => {
      this.cidades = _CIDADES;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar cidades: ${error.error}`);
    });
  }
  }

  limparCidade() {
    this.filtroTexto = '';
  }

  limparEstado() {
    this.cidades = [];
    this.estadoIdSelecionado = [];
    this.filtroTexto = '';
  }

}
