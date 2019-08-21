import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Produto } from 'src/app/_models/Cadastros/Produtos/produto';
import { ProdutoService } from 'src/app/_services/Cadastros/Produtos/produto.service';
import { BsLocaleService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { Permissao } from 'src/app/_models/Permissoes/permissao';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html'
})
export class ProdutoComponent implements OnInit, AfterViewInit {

  novo = false;
  editar = false;
  excluir = false;
  visualizar = false;

  produtosFiltrados: Produto[];
  produtos: Produto[];
  produto: Produto;
  produtoId: number;

  bodyExcluirProduto = '';

  // tslint:disable-next-line:variable-name
  _filtroLista: string;
  filtroProdutos: any;

  paginaAtual = 1;
  totalRegistros: number;

  constructor(private produtoService: ProdutoService,
              private localeService: BsLocaleService,
              private toastr: ToastrService,
              public permissaoService: PermissaoService
    ) {
      this.localeService.use('pt-br');
    }

  ngOnInit() {
    this.getProdutos();
  }

  ngAfterViewInit() {
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('PRODUTOS', 'NOVO').subscribe((_PERMISSAO: Permissao) => {
      this.novo = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('PRODUTOS', 'EDITAR').subscribe((_PERMISSAO: Permissao) => {
      this.editar = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('PRODUTOS', 'EXCLUIR').subscribe((_PERMISSAO: Permissao) => {
      this.excluir = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('PRODUTOS', 'VISUALIZAR').subscribe((_PERMISSAO: Permissao) => {
      this.visualizar = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
  }

  get filtroLista() {
    return this._filtroLista;
  }

  set filtroLista(value: string) {
    this._filtroLista = value;
    this.produtosFiltrados = this.filtrarProdutos(this.filtroLista);
  }

  excluirProduto(produto: Produto, template: any) {
    template.show();
    this.produto = produto;
    this.bodyExcluirProduto = `Tem certeza que deseja excluir o Produto: ${produto.descricao}, Código: ${produto.id}?`;
  }

  confirmarExclusao(template: any) {
    this.produtoService.excluirProduto(this.produto.id).subscribe(
    () => {
        template.hide();
        this.getProdutos();
        this.toastr.success('Excluído com sucesso!');
      }, error => {
        this.toastr.error(`Erro ao tentar Excluir: ${error}`);
      });
  }

  filtrarProdutos(filtrarPor: string): Produto[] {
    this.filtroProdutos = this.produtos;

    if (filtrarPor) {
      filtrarPor = filtrarPor.toLocaleLowerCase();
      this.filtroProdutos = this.produtos.filter(
        produto => produto.descricao.toLocaleLowerCase().indexOf(filtrarPor) !== -1
      );
    }

    this.totalRegistros = this.filtroProdutos.length;
    return this.filtroProdutos;
  }

  getProdutos() {
      this.produtoService.getAllProduto().subscribe(
        // tslint:disable-next-line:variable-name
        (_produtos: Produto[]) => {
        this.produtos = _produtos;
      }, error => {
        this.toastr.error(`Erro ao tentar carregar produtos: ${error}`);
      });
  }

}
