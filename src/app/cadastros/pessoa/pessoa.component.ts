import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Cidade } from 'src/app/_models/Cadastros/Uteis/Cidade';
import { Pessoa } from 'src/app/_models/Cadastros/Pessoas/Pessoa';
import { Estado } from 'src/app/_models/Cadastros/Uteis/Estado';
import { Permissao } from 'src/app/_models/Permissoes/permissao';
import { PessoaService } from 'src/app/_services/Cadastros/Pessoas/pessoa.service';
import { CidadeService } from 'src/app/_services/Cadastros/Uteis/cidade.service';
import { EstadoService } from 'src/app/_services/Cadastros/Uteis/estado.service';
import { BsLocaleService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { TiposPessoa } from 'src/app/_models/Cadastros/Pessoas/TiposPessoa';

@Component({
  selector: 'app-pessoa',
  templateUrl: './pessoa.component.html'
})
export class PessoaComponent implements OnInit, AfterViewInit {

  novo = false;
  editar = false;
  excluir = false;
  visualizar = false;

  pessoasFiltrados: Pessoa[];
  pessoa: Pessoa;
  pessoas: Pessoa[];

  modoSalvar = '';
  cadastroForm: FormGroup;
  bodyExcluirPessoa = '';

  paginaAtual = 1;
  totalRegistros = 0; number;

  status = ['ATIVO', 'INATIVO', 'TODOS'];
  statusFiltroSelecionado = 'ATIVO';

  filtrarPor = ['NOME', 'TIPO', 'CNPJ/CPF', 'CIDADE'];
  filtroSelecionado = 'NOME';

  cidades: Cidade[];
  cidadeIdSelecionado: any;

  estados: Estado[];
  estadoIdSelecionado: any;

  tiposPessoa: TiposPessoa[];
  tipoIdSelecionado: any;

  filtroRetorno: any;
  // tslint:disable-next-line:variable-name
  _filtroLista: string;

  valueCnpjCpfPipe = '';

  constructor(
    private pessoaService: PessoaService,
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
    this.getTipos();
    this.getPessoas();
  }

  ngAfterViewInit() {
    this.permissaoService.getPermissoesByFormulario(
      Object.assign({formulario: 'PESSOAS'})).subscribe((_PERMISSOES: Permissao[]) => {
      this.novo = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'NOVO')[0]);
      this.editar = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'EDITAR')[0]);
      this.excluir = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'EXCLUIR')[0]);
      this.visualizar = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'VISUALIZAR')[0]);
    });
  }

  getTipos() {
    this.pessoaService.getAllTiposPessoa().subscribe(
      (_TIPOS: TiposPessoa[]) => {
      this.tiposPessoa = _TIPOS;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Tipos: ${error.error}`);
    });
}

  excluirPessoa(pessoa: Pessoa, template: any) {
    this.pessoa = pessoa;
    this.bodyExcluirPessoa = `Tem certeza que deseja excluir : ${pessoa.nome}, Código: ${pessoa.id}?`;
    template.show();
  }

  confirmarExclusao(template: any) {
    this.pessoaService.excluirPessoa(this.pessoa.id).subscribe(
    () => {
        template.hide();
        this.getPessoas();
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
    this.pessoasFiltrados = this.filtrarPessoas(this._filtroLista);
  }

  setFiltroSelecionado(valor: any) {
    this.filtroSelecionado = valor;
  }

  setStatusFiltroSelecionado(valor: any) {
    this.statusFiltroSelecionado = valor;
    this.pessoasFiltrados = this.filtrarPessoas(this.filtroLista);
  }

  filtrarPessoas(filtrarPor: string): Pessoa[] {
    if (this.statusFiltroSelecionado !== 'TODOS') {
      this.filtroRetorno = this.pessoas.filter(_PESSOA => _PESSOA.status === this.statusFiltroSelecionado);
    } else {
      this.filtroRetorno = this.pessoas;
    }
    if (filtrarPor) {
      if (this.filtroSelecionado === 'NOME') {
        this.filtroRetorno = this.filtroRetorno
                            .filter(pessoa => pessoa.nome.toLocaleUpperCase().indexOf(filtrarPor.toLocaleUpperCase()) !== -1);
      } else if (this.filtroSelecionado === 'TIPO') {
        this.filtroRetorno = this.filtroRetorno;
      } else if (this.filtroSelecionado === 'CNPJ/CPF') {
        this.filtroRetorno = this.filtroRetorno
                            .filter(pessoa => pessoa.cnpjCpf.toLocaleUpperCase().indexOf(filtrarPor.toLocaleUpperCase()) !== -1);
      } else if (this.filtroSelecionado === 'CIDADE') {
        this.filtroRetorno = this.filtroRetorno
                            .filter(pessoa => pessoa.cidadeId === filtrarPor);
      }
    }
    this.totalRegistros = this.filtroRetorno.length;
    return this.filtroRetorno;
  }

  getPessoas() {
    this.pessoaService.getAllPessoa().subscribe(
      (_PESSOAS: Pessoa[]) => {
      this.pessoas = _PESSOAS;
      this.pessoasFiltrados = this.filtrarPessoas(this.filtroLista);
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar pessoas: ${error.error}`);
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
