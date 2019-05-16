import { Component, OnInit } from '@angular/core';
import { Cliente } from '../_models/Cadastros/Clientes/Cliente';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ClienteService } from '../_services/Cadastros/Clientes/cliente.service';
import { BsModalService, BsLocaleService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  clientesFiltrados: Cliente[];
  clientes: Cliente[];
  cliente: Cliente;
  modoSalvar = '';
  cadastroForm: FormGroup;
  bodyDeletarCliente = '';
  paginaAtual = 1;
  totalRegistros: number;
  status = ['ATIVO', 'INATIVO', 'PROSPECT', 'TODOS'];
  filtrarPor = ['COD.SIGA', 'RAZÃO SOCIAL', 'NOME FANTASIA', 'CNPJ/CPF', 'CIDADE', 'STATUS'];
  filtroSelecionado = 'NOME FANTASIA';
  statusFiltroSelecionado = 'ATIVO';
  filtroRetorno: any;
  // tslint:disable-next-line:variable-name
  _filtroLista: string;

  constructor(
    private clienteService: ClienteService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private toastr: ToastrService
    ) {
      this.localeService.use('pt-br');
    }

  excluirCliente(cliente: Cliente, template: any) {
    this.cliente = cliente;
    this.bodyDeletarCliente = `Tem certeza que deseja excluir o Colaborador: ${cliente.nomeFantasia}, Código: ${cliente.id}`;
    template.show();
  }

  confirmeDelete(template: any) {
    this.clienteService.deletarCliente(this.cliente.id).subscribe(
    () => {
        template.hide();
        this.getClientes();
        this.toastr.success('Excluído com sucesso!');
      }, error => {
        this.toastr.error(`Erro ao tentar Excluir: ${error}`);
      });
  }

  ngOnInit() {
    this.getClientes();
  }

  get filtroLista() {
    return this._filtroLista;
  }

  set filtroLista(value: string) {
    this._filtroLista = value;
    this.clientesFiltrados = this.filtroLista ? this.filtrarClientes(this.filtroLista) : this.clientes;
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

}
