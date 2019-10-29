import { Component, OnInit, ChangeDetectorRef, AfterViewChecked, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Pessoa } from 'src/app/_models/Cadastros/Pessoas/Pessoa';
import { Cidade } from 'src/app/_models/Cadastros/Uteis/Cidade';
import { PessoaTipos } from 'src/app/_models/Cadastros/Pessoas/PessoaTipos';
import { TiposPessoa } from 'src/app/_models/Cadastros/Pessoas/TiposPessoa';
import { Estado } from 'src/app/_models/Cadastros/Uteis/Estado';
import { EstadoService } from 'src/app/_services/Cadastros/Uteis/estado.service';
import { CidadeService } from 'src/app/_services/Cadastros/Uteis/cidade.service';
import { ToastrService } from 'ngx-toastr';
import { PessoaService } from 'src/app/_services/Cadastros/Pessoas/pessoa.service';
import { Router } from '@angular/router';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { PermissaoObjetos } from 'src/app/_models/Permissoes/permissaoObjetos';

@Component({
  selector: 'app-cadastrar-pessoa',
  templateUrl: './cadastrarPessoa.component.html'
})
export class CadastrarPessoaComponent implements OnInit, AfterViewChecked, AfterViewInit {

  formularioComponent = 'PESSOAS';
  cadastrar = false;
  editar = false;
  listar = false;
  visualizar = false;
  excluir = false;

  cadastroForm: FormGroup;
  pessoa: Pessoa;

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
              public router: Router,
              private changeDetectionRef: ChangeDetectorRef,
              public permissaoService: PermissaoService) { }

  ngOnInit() {
    this.getTipos();
    this.getEstados();
    this.validarForm();
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

  cadastrarPessoa() {
    if (this.cadastroForm.valid) {
      this.pessoa = Object.assign(this.cadastroForm.value, {id: 0, pessoaTipos: null});
      this.pessoaService.cadastrarPessoa(this.pessoa).subscribe(
        () => {

          this.pessoaService.getIdUltimaPessoa().subscribe(
            (_PESSOA: Pessoa) => {
              const IdUltimaPessoa = _PESSOA.id;
              this.pessoa = Object.assign(this.cadastroForm.value, {id: IdUltimaPessoa});

              this.pessoa.pessoaTipos = [];
              this.pessoaTipos.forEach(tipos => {
                this.pessoa.pessoaTipos.push(Object.assign({ pessoasId: IdUltimaPessoa , tiposPessoaId: tipos.tiposPessoaId}));
              });

              this.pessoaService.editarPessoa(this.pessoa).subscribe(
                () => {
                  this.toastr.success('Cadastrado com sucesso!');
                  this.router.navigate([`/pessoas/editar/${IdUltimaPessoa}`]);
              });
          });
        }, error => {
          console.log(error.error);
        }
      );
    }
  }

}
