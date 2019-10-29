import { Component, OnInit, Input } from '@angular/core';
import { Venda } from 'src/app/_models/Movimentos/Venda/Venda';
import { ProdutoService } from 'src/app/_services/Cadastros/Produtos/produto.service';
import { ProdutoGrupoChecks } from 'src/app/_models/Cadastros/Produtos/produtoGrupoChecks';
import { ToastrService } from 'ngx-toastr';
import { ProdutoCheckList } from 'src/app/_models/Cadastros/Produtos/produtoCheckList';
import { VendaCheckList } from 'src/app/_models/Movimentos/Venda/VendaCheckList';
import { VendaService } from 'src/app/_services/Movimentos/Venda/venda.service';

@Component({
  selector: 'app-check-list-venda',
  templateUrl: './checkListVenda.component.html',
  styleUrls: ['./checkListVenda.component.css']
})
export class CheckListVendaComponent implements OnInit {

  @Input() venda: Venda;
  @Input() pedido: boolean;

  ImpCadProdSelecionado = false;
  ImpFrenteSelecionado = false;
  ImpFinanceiroSelecionado = false;

  gruposCheckList: ProdutoGrupoChecks[] = [];
  vendaCheckList: VendaCheckList[] = [];

  border = '';
  coluna = '';

  constructor(private produtoService: ProdutoService,
              private vendaService: VendaService,
              private toastr: ToastrService) { }

  ngOnInit() {
    (this.pedido === true) ? this.border = 'border' : this.border = '';
    (this.pedido === true) ? this.coluna = 'col-md-12' : this.coluna = 'col-md-6';
    if (this.venda) {
      this.getGruposCheckList();
    }
  }

  carregarCheckList() {
    this.gruposCheckList.forEach((grupo: ProdutoGrupoChecks) => {
      grupo.checkList.forEach((check: ProdutoCheckList) => {
        const vendaCheck = this.vendaCheckList.filter(c => c.checkId === check.id);
        if (vendaCheck.length > 0) {
          check = Object.assign(check, { opcaoSelecionadaId: vendaCheck[0].opcaoSelecionadaId });
        }
      });
    });
  }

  salvarAlteracoes() {
    this.gruposCheckList.forEach((grupo: ProdutoGrupoChecks) => {
      grupo.checkList.forEach((check: ProdutoCheckList) => {
        const vendaCheck = this.vendaCheckList.filter(c => c.checkId === check.id);
        if (vendaCheck.length > 0) {
          this.vendaCheckList.filter(c => c.checkId === check.id)[0] = Object.assign(vendaCheck[0],
              {opcaoSelecionadaId: (check.opcaoSelecionadaId) ? check.opcaoSelecionadaId : null});
        } else if (vendaCheck.length === 0) {
          const cadastrarCheck = Object.assign({id: 0, vendaId: this.venda.id, checkId: check.id,
              opcaoSelecionadaId: (check.opcaoSelecionadaId) ? check.opcaoSelecionadaId : null});
          this.vendaCheckList.push(cadastrarCheck);
        }
      });
    });
    this.vendaService.editarVendaCheckList(this.vendaCheckList).subscribe(() => {
      this.toastr.success('Editado com sucesso!');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar editar VendaCheckList: ${error.error}`);
    });
  }

  getVendaCheckList() {
    this.vendaService.getVendaCheckList(this.venda.id).subscribe(
      (_CHECKLIST: VendaCheckList[]) => {
        this.vendaCheckList = _CHECKLIST;
        this.carregarCheckList();
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar VendaCheckList: ${error.error}`);
    });
  }

  getGruposCheckList() {
    this.produtoService.getProdutoGrupoCheckByProdutoId(this.venda.vendaProdutos[0].produtosId).subscribe(
      (_GRUPOS: ProdutoGrupoChecks[]) => {
        this.gruposCheckList = _GRUPOS;
        this.getVendaCheckList();
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar produtos: ${error.error}`);
    });
  }

  marcarOpcao(grupo: ProdutoGrupoChecks, checkAlterar: any, opcaoSelecionada: any, event: any) {
    grupo.checkList.forEach( (check) => {
      if (checkAlterar.id === check.id) {
        check = Object.assign(check, {  opcaoSelecionadaId: (event.checked === true) ? opcaoSelecionada.id : null});
      }
    });
  }
}
