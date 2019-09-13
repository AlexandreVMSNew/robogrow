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
  totalRegistros = 0; number;

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
    this.permissaoService.getPermissoesByFormulario(
      Object.assign({formulario: 'PRODUTOS'})).subscribe((_PERMISSOES: Permissao[]) => {
      this.novo = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'NOVO')[0]);
      this.editar = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'EDITAR')[0]);
      this.excluir = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'EXCLUIR')[0]);
      this.visualizar = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'VISUALIZAR')[0]);
    });
  }

  getProdutos() {
      this.produtoService.getAllProduto().subscribe(
        // tslint:disable-next-line:variable-name
        (_produtos: Produto[]) => {
        this.produtos = _produtos;
      }, error => {
        this.toastr.error(`Erro ao tentar carregar produtos: ${error.error}`);
      });
  }

}
