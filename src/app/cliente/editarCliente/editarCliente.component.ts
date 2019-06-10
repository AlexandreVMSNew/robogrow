import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ClienteService } from 'src/app/_services/Cadastros/Clientes/cliente.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from 'src/app/_models/Cadastros/Clientes/Cliente';
import { Estado } from 'src/app/_models/Cadastros/Uteis/Estado';
import { Cidade } from 'src/app/_models/Cadastros/Uteis/Cidade';
import { Sistema } from 'src/app/_models/Cadastros/Sistemas/Sistema';
import { Geracao } from 'src/app/_models/Cadastros/Sistemas/Geracao';
import { Versao } from 'src/app/_models/Cadastros/Sistemas/Versao';
import { EstadoService } from 'src/app/_services/Cadastros/Uteis/estado.service';
import { CidadeService } from 'src/app/_services/Cadastros/Uteis/cidade.service';
import { SistemaClienteService } from 'src/app/_services/Cadastros/Clientes/sistemaCliente.service';
import { ClienteVersoes } from 'src/app/_models/Cadastros/Clientes/ClienteVersoes';
import { ClienteGrupos } from 'src/app/_models/Cadastros/Clientes/ClienteGrupos';
import { GrupoClienteService } from 'src/app/_services/Cadastros/Clientes/grupoCliente.service';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';

@Component({
  selector: 'app-editar-cliente',
  templateUrl: './editarCliente.component.html',
  styleUrls: ['./editarCliente.component.css']
})
export class EditarClienteComponent implements OnInit {

  titulo = 'Cadastrar';
  cadastroForm: FormGroup;
  cadastroGrupoForm: FormGroup;
  cliente: Cliente;

  categorias = ['A', 'B', 'C', 'D'];
  categoriaSelecionado: string;

  status = ['ATIVO', 'INATIVO', 'PROSPECT'];
  statusSelecionado: string;

  grupo: ClienteGrupos;
  grupos: ClienteGrupos[];
  grupoIdSelecionado: any;

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
              private clienteGruposService: GrupoClienteService,
              private sistemaClienteService: SistemaClienteService,
              private changeDetectionRef: ChangeDetectorRef,
              public permissaoService: PermissaoService) {
      this.localeService.use('pt-br');
  }

  ngOnInit() {
    this.idCliente = +this.router.snapshot.paramMap.get('id');
    this.getEstados();
    this.getSistemas();
    this.getGrupos();
    this.validation();
    this.validationGrupo();
    this.carregarCliente();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewChecked() {
    this.changeDetectionRef.detectChanges();
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
        grupoId: [0],
        categoria: [''],
        proprietario: [''],
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
        sistemaId: ['', Validators.required],
        geracaoId: ['', Validators.required],
        clienteVersoes: [this.fb.group({
          clienteId: [''],
          versaoId: ['']
        }), Validators.required],
        status: ['']
    });
  }

  adicionarClienteVersoes(versoesSelecionadas: any) {
    this.versoesCliente = [];
    versoesSelecionadas.forEach(versoes => {
      this.versoesCliente.push(Object.assign({ clienteId: this.idCliente, versaoId: versoes}));
    });
  }

  validationGrupo() {
    this.cadastroGrupoForm = this.fb.group({
        id: [''],
        nome: ['', Validators.required]
    });
  }

  getGrupos() {
    this.clienteGruposService.getAllGrupos().subscribe(
      (_GRUPOS: ClienteGrupos[]) => {
      this.grupos = _GRUPOS;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar grupos: ${error.error}`);
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

  abrirModalNovoGrupo(template: any) {
    this.cadastroGrupoForm.reset();
    template.show();
  }

  cadastrarGrupo(template: any) {
    if (this.cadastroGrupoForm.valid) {
      this.grupo = Object.assign(this.cadastroGrupoForm.value, {id: 0});
      this.clienteGruposService.novoGrupo(this.grupo).subscribe(
        () => {
          this.getGrupos();
          this.toastr.success('Grupo Cadastrado com Sucesso!');
          template.hide();
        }, error => {
          console.log(error.error);
        }
      );
    }
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
