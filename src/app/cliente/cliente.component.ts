import { Component, OnInit } from '@angular/core';
import { Cliente } from '../_models/Cliente';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ClienteService } from '../_services/cliente.service';
import { BsModalService, BsLocaleService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Estado } from '../_models/Estado';
import { Cidade } from '../_models/Cidade';
import { EstadoService } from '../_services/estado.service';
import { CidadeService } from '../_services/cidade.service';

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

  get filtroLista() {
    return this._filtroLista;
  }

  set filtroLista(value: string) {
    this._filtroLista = value;
    this.clientesFiltrados = this.filtroLista ? this.filtrarClientes(this.filtroLista) : this.clientes;
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

  filtrarClientes(filtrarPor: string): Cliente[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.clientes.filter(
      cliente => cliente.nomeFantasia.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  getClientes() {
      this.clienteService.getAllCliente().subscribe(
        (_CLIENTES: Cliente[]) => {
        this.clientes = _CLIENTES;
        this.clientesFiltrados = this.clientes;
      }, error => {
        console.log(error.error);
        this.toastr.error(`Erro ao tentar carregar clientes: ${error.error}`);
      });
  }

}
