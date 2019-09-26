import { Component, OnInit, Input } from '@angular/core';
import { Venda } from 'src/app/_models/Movimentos/Venda/Venda';
import { ProdutoService } from 'src/app/_services/Cadastros/Produtos/produto.service';
import { ProdutoGrupoChecks } from 'src/app/_models/Cadastros/Produtos/produtoGrupoChecks';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-check-list-venda',
  templateUrl: './checkListVenda.component.html',
  styleUrls: ['./checkListVenda.component.css']
})
export class CheckListVendaComponent implements OnInit {

  @Input() venda: Venda;

  ImpCadProdSelecionado = false;
  ImpFrenteSelecionado = false;
  ImpFinanceiroSelecionado = false;

  grupoListaImp = [
    {
      id: 1,
      checks: [
        {
          id: 1,
          descricao: 'Cadastro de Produto',
          opcaoSelecionada: 1,
        },
        {
          id: 2,
          descricao: 'Frente de Loja',
          opcaoSelecionada: 2,
        },
        {
          id: 3,
          descricao: 'Financeiro',
          opcaoSelecionada: 3,
        },
      ],
      opcoes: [
        {
          id: 1,
          descricao: 'Remoto',
        },
        {
          id: 2,
          descricao: 'Presencial',
        },
        {
          id: 3,
          descricao: 'Nenhuma',
        }
      ]
    }
  ];

  gruposCheckList: ProdutoGrupoChecks[] = [];

  constructor(private produtoService: ProdutoService,
              private toastr: ToastrService) { }

  ngOnInit() {
    if (this.venda) {
      this.getGruposCheckList();
    }
  }

  salvarAlteracoes() {

  }

  getGruposCheckList() {
    this.produtoService.getProdutoGrupoCheckByProdutoId(this.venda.vendaProdutos[0].produtosId).subscribe(
      (_GRUPOS: ProdutoGrupoChecks[]) => {
        this.gruposCheckList = _GRUPOS;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar produtos: ${error.error}`);
    });
  }

  alterarOpcao(grupo: ProdutoGrupoChecks, checkAlterar: any, opcaoSelecionada: any) {
    grupo.checkList.forEach( (check) => {
      if (checkAlterar.id === check.id) {
        check = Object.assign(check, { opcaoSelecionada: opcaoSelecionada.id});
      }
    });
  }
}
