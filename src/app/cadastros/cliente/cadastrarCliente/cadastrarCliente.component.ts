import { Component, OnInit, ChangeDetectorRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Cliente } from 'src/app/_models/Cadastros/Clientes/Cliente';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/_services/Cadastros/Clientes/cliente.service';
import { EstadoService } from 'src/app/_services/Cadastros/Uteis/estado.service';
import { CidadeService } from 'src/app/_services/Cadastros/Uteis/cidade.service';
import { Estado } from 'src/app/_models/Cadastros/Uteis/Estado';
import { Cidade } from 'src/app/_models/Cadastros/Uteis/Cidade';
import { GrupoClienteService } from 'src/app/_services/Cadastros/Clientes/grupoCliente.service';
import { ClienteGrupos } from 'src/app/_models/Cadastros/Clientes/ClienteGrupos';
import { Sistema } from 'src/app/_models/Cadastros/Sistemas/Sistema';
import { Geracao } from 'src/app/_models/Cadastros/Sistemas/Geracao';
import { Versao } from 'src/app/_models/Cadastros/Sistemas/Versao';
import { ClienteVersoes } from 'src/app/_models/Cadastros/Clientes/ClienteVersoes';
import { SistemaClienteService } from 'src/app/_services/Cadastros/Clientes/sistemaCliente.service';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { PermissaoObjetos } from 'src/app/_models/Permissoes/permissaoObjetos';

@Component({
  selector: 'app-cadastrar-cliente',
  templateUrl: './cadastrarCliente.component.html',
  styleUrls: ['./cadastrarCliente.component.css']
})

export class CadastrarClienteComponent implements OnInit, AfterViewInit, AfterViewChecked {

  formularioComponent = 'CLIENTES';
  cadastrar = false;
  editar = false;
  listar = false;
  visualizar = false;
  excluir = false;

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

  valueCnpjCpfPipe = '';
  valueCepPipe = '';
  valueCelularPipe = '';
  valueTelefonePipe = '';
  valueIePipe = '';

  constructor(public fb: FormBuilder,
              private estadoService: EstadoService,
              private cidadeService: CidadeService,
              private toastr: ToastrService,
              private clienteService: ClienteService,
              private clienteGruposService: GrupoClienteService,
              private sistemaClienteService: SistemaClienteService,
              public router: Router,
              private changeDetectionRef: ChangeDetectorRef,
              public permissaoService: PermissaoService) {
               }

  ngOnInit() {
    this.getEstados();
    this.getGrupos();
    this.getSistemas();
    this.validation();
    this.validationGrupo();
  }

  ngAfterViewInit() {
    this.permissaoService.getPermissaoObjetosByFormularioAndNivelId(Object.assign({ formulario: this.formularioComponent }))
    .subscribe((permissaoObjetos: PermissaoObjetos[]) => {
      const permissaoFormulario = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'FORMULÁRIO');
      this.cadastrar = (permissaoFormulario !== null ) ? permissaoFormulario.cadastrar : false;
      this.editar = (permissaoFormulario !== null ) ? permissaoFormulario.editar : false;
      this.listar = (permissaoFormulario !== null ) ? permissaoFormulario.listar : false;
      this.visualizar = (permissaoFormulario !== null ) ? permissaoFormulario.visualizar : false;
      this.excluir = (permissaoFormulario !== null ) ? permissaoFormulario.excluir : false;
    }, error => {
      console.log(error.error);
    });
  }

  ngAfterViewChecked() {
    this.changeDetectionRef.detectChanges();
  }

  validation() {
    this.cadastroForm = this.fb.group({
        id:  [''],
        codSiga: [''],
        nLoja: [''],
        razaoSocial: ['', Validators.required],
        nomeFantasia: ['', Validators.required],
        grupoId: [0, Validators.required],
        categoria: [''],
        contato: [''],
        telefone: ['', Validators.required],
        celular: [''],
        cnpjCpf: ['', Validators.required],
        ie: [''],
        estadoId: [0, Validators.required],
        cidadeId: [0, Validators.required],
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
      this.versoesCliente.push(Object.assign({ clienteId: 0, versaoId: versoes}));
    });
  }

  validationGrupo() {
    this.cadastroGrupoForm = this.fb.group({
        id: [''],
        nome: ['', Validators.required]
    });
  }

  getGrupos() {
    this.clienteGruposService.getGrupos().subscribe(
      (_GRUPOS: ClienteGrupos[]) => {
      this.grupos = _GRUPOS;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar grupos: ${error.error}`);
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

  getSistemas() {
    this.sistemaClienteService.getSistema().subscribe(
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
      this.sistemaClienteService.getGeracao(SistemaId).subscribe(
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
      this.sistemaClienteService.getGeracaoVersoes(GeracaoId).subscribe(
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
    this.cadastroForm.patchValue({
      cidadeId: ''
    });
  }

  limparEstado() {
    this.cidades = [];
    this.cadastroForm.patchValue({
      estadoId: '',
      cidadeId: ''
    });
  }

  abrirModalCadastrarGrupo(template: any) {
    this.cadastroGrupoForm.reset();
    template.show();
  }

  cadastrarGrupo(template: any) {
    if (this.cadastroGrupoForm.valid) {
      this.grupo = Object.assign(this.cadastroGrupoForm.value, {id: 0});
      this.clienteGruposService.cadastrarGrupo(this.grupo).subscribe(
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

  cadastrarCliente() {
    if (this.cadastroForm.valid) {
      this.cliente = Object.assign(this.cadastroForm.value, {id: 0, clienteVersoes: null});
      this.clienteService.cadastrarCliente(this.cliente).subscribe(
        () => {

          this.clienteService.getIdUltimoCliente().subscribe(
            (_CLIENTE: Cliente) => {
              const IdUltimoCliente = _CLIENTE.id;
              this.cliente = Object.assign(this.cadastroForm.value, {id: IdUltimoCliente});

              this.cliente.clienteVersoes = [];
              this.versoesCliente.forEach(versoes => {
                this.cliente.clienteVersoes.push(Object.assign({ clienteId: IdUltimoCliente , versaoId: versoes.versaoId}));
              });

              this.clienteService.editarCliente(this.cliente).subscribe(
                () => {
                  this.toastr.success('Cadastrado com sucesso!');
                  this.router.navigate([`/clientes/editar/${IdUltimoCliente}`]);
              });
          });
        }, error => {
          console.log(error.error);
        }
      );
    }
  }

}
