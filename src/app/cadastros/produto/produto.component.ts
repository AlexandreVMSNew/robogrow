import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Produto } from 'src/app/_models/Cadastros/Produtos/produto';
import { ProdutoService } from 'src/app/_services/Cadastros/Produtos/produto.service';
import { BsLocaleService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { Permissao } from 'src/app/_models/Permissoes/permissao';
import { PermissaoObjetos } from 'src/app/_models/Permissoes/permissaoObjetos';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html'
})
export class ProdutoComponent implements OnInit, AfterViewInit {

  formularioComponent = 'PRODUTOS';
  cadastrar = false;
  editar = false;
  listar = false;
  visualizar = false;
  excluir = false;

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


  getProdutos() {
      this.produtoService.getProduto().subscribe(
        // tslint:disable-next-line:variable-name
        (_produtos: Produto[]) => {
        this.produtos = _produtos;
      }, error => {
        console.log(error.error);
        this.toastr.error(`Erro ao tentar carregar produtos: ${error.error}`);
      });
  }

}
