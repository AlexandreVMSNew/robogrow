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

  clientesFiltrados: Cliente[];
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

  filtroRetorno: any;
  // tslint:disable-next-line:variable-name
  _filtroLista: string;

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
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('CLIENTES', 'NOVO').subscribe((_PERMISSAO: Permissao) => {
      this.novo = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('CLIENTES', 'EDITAR').subscribe((_PERMISSAO: Permissao) => {
      this.editar = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('CLIENTES', 'EXCLUIR').subscribe((_PERMISSAO: Permissao) => {
      this.excluir = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('CLIENTES', 'VISUALIZAR').subscribe((_PERMISSAO: Permissao) => {
      this.visualizar = this.permissaoService.verificarPermissao(_PERMISSAO);
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

  get filtroLista(): string {
    return this._filtroLista;
  }

  set filtroLista(value: string) {
    this._filtroLista = value;
    this.clientesFiltrados = this.filtrarClientes(this._filtroLista);
  }

  setFiltroSelecionado(valor: any) {
    this.filtroSelecionado = valor;
  }

  setStatusFiltroSelecionado(valor: any) {
    this.statusFiltroSelecionado = valor;
    this.clientesFiltrados = this.filtrarClientes(this.filtroLista);
  }

  filtrarClientes(filtrarPor: string): Cliente[] {
    if (this.statusFiltroSelecionado !== 'TODOS') {
      this.filtroRetorno = this.clientes.filter(_CLIENTE => _CLIENTE.status === this.statusFiltroSelecionado);
    } else {
      this.filtroRetorno = this.clientes;
    }

    if (filtrarPor) {
      if (this.filtroSelecionado === 'COD.SIGA') {
        this.filtroRetorno = this.filtroRetorno
                            .filter(cliente => cliente.codSiga.toLocaleUpperCase().indexOf(filtrarPor.toLocaleUpperCase()) !== -1);
      } else if (this.filtroSelecionado === 'RAZÃO SOCIAL') {
        this.filtroRetorno = this.filtroRetorno
                            .filter(cliente => cliente.razaoSocial.toLocaleUpperCase().indexOf(filtrarPor.toLocaleUpperCase()) !== -1);
      } else if (this.filtroSelecionado === 'NOME FANTASIA') {
        this.filtroRetorno = this.filtroRetorno
                            .filter(cliente => cliente.nomeFantasia.toLocaleUpperCase().indexOf(filtrarPor.toLocaleUpperCase()) !== -1);
      } else if (this.filtroSelecionado === 'CNPJ/CPF') {
        this.filtroRetorno = this.filtroRetorno
                            .filter(cliente => cliente.cnpjCpf.toLocaleUpperCase().indexOf(filtrarPor.toLocaleUpperCase()) !== -1);
      } else if (this.filtroSelecionado === 'CIDADE') {
        this.filtroRetorno = this.filtroRetorno
                            .filter(cliente => cliente.cidadeId === filtrarPor);
      }
    }
    this.totalRegistros = this.filtroRetorno.length;
    return this.filtroRetorno;
  }

  getClientes() {
    this.clienteService.getAllCliente().subscribe(
      (_CLIENTES: Cliente[]) => {
      this.clientes = _CLIENTES;
      this.clientesFiltrados = this.filtrarClientes(this.filtroLista);
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar clientes: ${error.error}`);
    });
  }

  getEstados() {
    this.estadoService.getAllEstados().subscribe(
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
    this.filtroLista = '';
  }

  limparEstado() {
    this.cidades = [];
    this.estadoIdSelecionado = [];
    this.filtroLista = '';
  }

}
