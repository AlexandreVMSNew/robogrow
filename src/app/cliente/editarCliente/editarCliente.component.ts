import { Component, OnInit, ViewChild } from '@angular/core';
import { ClienteService } from 'src/app/_services/cliente.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from 'src/app/_models/Cliente';
import { Estado } from 'src/app/_models/Estado';
import { Cidade } from 'src/app/_models/Cidade';
import { Sistema } from 'src/app/_models/sistema';
import { Geracao } from 'src/app/_models/geracao';
import { Versao } from 'src/app/_models/Versao';
import { EstadoService } from 'src/app/_services/estado.service';
import { CidadeService } from 'src/app/_services/cidade.service';
import { SistemaClienteService } from 'src/app/_services/sistemaCliente.service';
import { ClienteVersoes } from 'src/app/_models/ClienteVersoes';

@Component({
  selector: 'app-editar-cliente',
  templateUrl: './editarCliente.component.html',
  styleUrls: ['./editarCliente.component.css']
})
export class EditarClienteComponent implements OnInit {

  titulo = 'Cadastrar';
  cadastroForm: FormGroup;
  cliente: Cliente;

  @ViewChild('selectEstados') selectEstados: any;
  @ViewChild('selectCidades') selectCidades: any;

  estados: Estado[];
  estadoIdSelecionado: any;
  cidadeIdSelecionado: any;
  cidades: Cidade[];

  sistemas: Sistema[];
  sistemaIdSelecionado: any;

  geracoes: Geracao[];
  geracaoIdSelecionado: any;

  versoes: Versao[];
  versoesIdSelecionado: any;
  versoesCliente: ClienteVersoes[];
  idCliente: number;
  valueCnpjCpfPipe = '';
  valueCepPipe = '';
  valueCelularPipe = '';
  valueTelefonePipe = '';
  valueIePipe = '';

  constructor(private clienteService: ClienteService,
              private router: ActivatedRoute,
              private fb: FormBuilder,
              private localeService: BsLocaleService,
              private toastr: ToastrService,
              private estadoService: EstadoService,
              private cidadeService: CidadeService,
              private sistemaClienteService: SistemaClienteService) {
      this.localeService.use('pt-br');
  }

  ngOnInit() {
    this.idCliente = +this.router.snapshot.paramMap.get('id');
    this.getEstados();
    this.getSistemas();
    this.validation();
    this.carregarCliente();
  }

  carregarCliente() {
    this.clienteService.getClienteById(this.idCliente)
      .subscribe(
        (cliente: Cliente) => {
          this.cliente = Object.assign({}, cliente);
          this.cadastroForm.patchValue(this.cliente);

          this.estadoIdSelecionado = this.cliente.estadoId;
          this.getCidades(this.estadoIdSelecionado);
          this.cidadeIdSelecionado = this.cliente.cidadeId;

          this.sistemaIdSelecionado = this.cliente.sistemaId;
          this.getGeracoes(this.sistemaIdSelecionado);
          this.geracaoIdSelecionado = this.cliente.geracaoId;
          this.getVersoesGeracao(this.geracaoIdSelecionado);
          this.versoesIdSelecionado = [];
          this.versoesCliente = [];
          this.cliente.clienteVersoes.forEach(versoes => {
            this.versoesCliente.push(versoes);
            this.versoesIdSelecionado.push(versoes.versaoId);
          });

        }, error => {
          this.toastr.error(`Erro ao tentar Editar: ${error.error}`);
          console.log(error);
        });
  }

  validation() {
    this.cadastroForm = this.fb.group({
        id:  [''],
        codSiga: [''],
        nLoja: [''],
        razaoSocial: ['', Validators.required],
        nomeFantasia: ['', Validators.required],
        proprietario: [''],
        gerente: [''],
        telefone: ['', Validators.required],
        celular: [''],
        cnpjCpf: ['', Validators.required],
        iE: [''],
        estadoId: ['', Validators.required],
        cidadeId: ['', Validators.required],
        cep: ['', Validators.required],
        endereco: ['', Validators.required],
        bairro: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        grupo: [''],
        sistemaId: ['', Validators.required],
        geracaoId: ['', Validators.required],
        clienteVersoes: [this.fb.group({
          cliente: [''],
          versao: ['']
        }), Validators.required],
        status: ['']
    });
  }

  criaClienteVersoes(clienteVersaoId: any): FormGroup {
    return this.fb.group({
      clienteId: [this.idCliente],
      versaoId: [clienteVersaoId]
    });
  }

  adicionarClienteVersoes(versoesSelecionadas: any) {
    this.versoesCliente = [];
    versoesSelecionadas.forEach(versoes => {
      this.versoesCliente.push(Object.assign({ clienteId: this.idCliente, versaoId: versoes}));
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

  getSistemas() {
    this.sistemaClienteService.getAllSistema().subscribe(
      (_SISTEMAS: Sistema[]) => {
      this.sistemas = _SISTEMAS;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar sistemas: ${error.error}`);
    });
  }

  getGeracoes(SistemaId: number) {
      if (SistemaId != null) {
      this.geracaoIdSelecionado = [];
      this.versoesIdSelecionado = [];
      this.sistemaClienteService.getAllGeracao(SistemaId).subscribe(
        (_GERACOES: Geracao[]) => {
        this.geracoes = _GERACOES;
      }, error => {
        console.log(error.error);
        this.toastr.error(`Erro ao tentar carregar geracoes: ${error.error}`);
      });
    }
  }

  getVersoesGeracao(GeracaoId: number) {
    if (GeracaoId != null) {
      this.sistemaClienteService.getAllGeracaoVersoes(GeracaoId).subscribe(
        (_VERSOES: Versao[]) => {
        this.versoes = _VERSOES;
      }, error => {
        console.log(error.error);
        this.toastr.error(`Erro ao tentar carregar versoes geracao: ${error.error}`);
      });
    }
  }

  limparSistema() {
    this.geracoes = [];
    this.geracaoIdSelecionado = [];
    this.versoes = [];
    this.versoesIdSelecionado = [];
    this.cadastroForm.patchValue({
      sistemaId: '',
      geracaoId: '',
      versao: ''
    });
  }

  limparGeracao() {
    this.geracaoIdSelecionado = [];
    this.versoes = [];
    this.versoesIdSelecionado = [];
    this.cadastroForm.patchValue({
      geracaoId: '',
      versao: ''
    });
  }

  limparVersoes() {
    this.versoesIdSelecionado = [];
    this.cadastroForm.patchValue({
      versao: ''
    });
  }

  limparCidade() {
    this.cidadeIdSelecionado = [];
    this.cadastroForm.patchValue({
      cidadeId: ''
    });
  }

  limparEstado() {
    this.cidades = [];
    this.estadoIdSelecionado = [];
    this.cidadeIdSelecionado = [];
    this.cadastroForm.patchValue({
      estadoId: '',
      cidadeId: ''
    });
  }

  salvarAlteracao() {
    this.cliente = Object.assign({ id: this.cliente.id }, this.cadastroForm.value);
    this.cliente.clienteVersoes = [];
    this.versoesCliente.forEach(versoes => {
      this.cliente.clienteVersoes.push(versoes);
    });
    this.clienteService.editarCliente(this.cliente).subscribe(
      () => {
        this.toastr.success('Editado com sucesso!');
        this.carregarCliente();
      }, error => {
        this.toastr.error(`Erro ao tentar Editar: ${error.error}`);
        console.log(error.error);
      });
  }
}
