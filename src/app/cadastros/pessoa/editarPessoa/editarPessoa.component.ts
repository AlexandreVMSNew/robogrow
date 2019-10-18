import { Component, OnInit, AfterViewChecked, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Pessoa } from 'src/app/_models/Cadastros/Pessoas/Pessoa';
import { Estado } from 'src/app/_models/Cadastros/Uteis/Estado';
import { Cidade } from 'src/app/_models/Cadastros/Uteis/Cidade';
import { TiposPessoa } from 'src/app/_models/Cadastros/Pessoas/TiposPessoa';
import { PessoaTipos } from 'src/app/_models/Cadastros/Pessoas/PessoaTipos';
import { EstadoService } from 'src/app/_services/Cadastros/Uteis/estado.service';
import { CidadeService } from 'src/app/_services/Cadastros/Uteis/cidade.service';
import { ToastrService } from 'ngx-toastr';
import { PessoaService } from 'src/app/_services/Cadastros/Pessoas/pessoa.service';
import { ActivatedRoute } from '@angular/router';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { Permissao } from 'src/app/_models/Permissoes/permissao';

@Component({
  selector: 'app-editar-pessoa',
  templateUrl: './editarPessoa.component.html'
})
export class EditarPessoaComponent implements OnInit, AfterViewChecked, AfterViewInit {

  editar = false;
  cadastroForm: FormGroup;
  pessoa: Pessoa;
  idPessoa: number;

  status = ['ATIVO', 'INATIVO'];
  statusSelecionado: string;

  estados: Estado[];
  estadoIdSelecionado: any;

  cidadeIdSelecionado: any;
  cidades: Cidade[];

  tiposPessoa: TiposPessoa[];
  tiposIdSelecionado: any;
  pessoaTipos: PessoaTipos[];

  valueCnpjCpfPipe = '';
  valueCepPipe = '';
  valueCelularPipe = '';
  valueTelefonePipe = '';
  valueIePipe = '';

  constructor(public fb: FormBuilder,
              private estadoService: EstadoService,
              private cidadeService: CidadeService,
              private toastr: ToastrService,
              private pessoaService: PessoaService,
              public router: ActivatedRoute,
              private changeDetectionRef: ChangeDetectorRef,
              public permissaoService: PermissaoService) { }

  ngOnInit() {
    this.idPessoa = +this.router.snapshot.paramMap.get('id');
    this.getTipos();
    this.getEstados();
    this.carregarPessoa();
    this.validarForm();
  }

  ngAfterViewChecked() {
    this.changeDetectionRef.detectChanges();
  }

  ngAfterViewInit() {
    this.permissaoService.getPermissoesByFormulario(
      Object.assign({formulario: 'PESSOAS'})).subscribe((_PERMISSOES: Permissao[]) => {
      this.editar = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'EDITAR')[0]);
    });
  }


  carregarPessoa() {
    this.pessoaService.getPessoaById(this.idPessoa)
      .subscribe(
        (_PESSOA: Pessoa) => {
          this.pessoa = Object.assign({}, _PESSOA);
          this.cadastroForm.patchValue(this.pessoa);

          this.estadoIdSelecionado = this.pessoa.estadoId;
          this.getCidades(this.estadoIdSelecionado);
          this.cidadeIdSelecionado = this.pessoa.cidadeId;

          this.tiposIdSelecionado = [];
          this.pessoaTipos = [];
          this.pessoa.pessoaTipos.forEach(tipos => {
            this.pessoaTipos.push(tipos);
            this.tiposIdSelecionado.push(tipos.tiposPessoaId);
          });
        }, error => {
          this.toastr.error(`Erro ao tentar carregar Pessoa: ${error.error}`);
          console.log(error);
        });
  }


  validarForm() {
    this.cadastroForm = this.fb.group({
        id:  [''],
        razaoSocial: [''],
        nome: ['', Validators.required],
        telefone: ['', Validators.required],
        celular: [''],
        cnpjCpf: ['', Validators.required],
        iE: [''],
        estadoId: [0, Validators.required],
        cidadeId: [0, Validators.required],
        cep: ['', Validators.required],
        endereco: ['', Validators.required],
        bairro: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        pessoaTipos: [this.fb.group({
          pessoasId: [''],
          tiposPessoaId: ['']
        }), Validators.required],
        status: ['', Validators.required]
    });
  }

  salvarAlteracoes() {
    this.pessoa = Object.assign({ id: this.pessoa.id }, this.cadastroForm.value);
    this.pessoa.pessoaTipos = [];
    this.pessoaTipos.forEach(tipos => {
      this.pessoa.pessoaTipos.push(tipos);
    });
    this.pessoaService.editarPessoa(this.pessoa).subscribe(
      () => {
        this.toastr.success('Editado com sucesso!');
        this.carregarPessoa();
      }, error => {
        this.toastr.error(`Erro ao tentar Editar: ${error.error}`);
        console.log(error.error);
      });
  }

  adicionarPessoaTipos(tiposSelecionados: any) {
    this.pessoaTipos = [];
    tiposSelecionados.forEach(tipo => {
      this.pessoaTipos.push(Object.assign({ pessoasId: 0, tiposPessoaId: tipo}));
    });
  }

  getTipos() {
    this.pessoaService.getTiposPessoa().subscribe(
      (_TIPOS: TiposPessoa[]) => {
      this.tiposPessoa = _TIPOS;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Tipos: ${error.error}`);
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
}
