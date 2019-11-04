import { Component, OnInit, Input } from '@angular/core';
import { Venda } from 'src/app/_models/Movimentos/Venda/Venda';
import { ProdutoItem } from 'src/app/_models/Cadastros/Produtos/produtoItem';
import { VendaService } from 'src/app/_services/Movimentos/Venda/venda.service';
import { RecebimentoService } from 'src/app/_services/Financeiro/Recebimentos/recebimento.service';
import { PrevisaoVendaComponent } from './previsaoVenda/previsaoVenda.component';
import { TemplateModalService } from 'src/app/_services/Uteis/TemplateModal/templateModal.service';
import { RecebimentosVendaComponent } from './recebimentosVenda/recebimentosVenda.component';
import { PagamentosVendaComponent } from './pagamentosVenda/pagamentosVenda.component';

@Component({
  selector: 'app-financeiro-venda',
  templateUrl: './financeiroVenda.component.html',
  styleUrls: ['./financeiroVenda.component.css']
})
export class FinanceiroVendaComponent implements OnInit {

  @Input() venda: Venda;
  @Input() cadastrarValorRealizado = false;
  @Input() cadastrarValorPrevisto = false;

  produtoItem: ProdutoItem;

  vendaItensEntrada: ProdutoItem[] = [];
  vendaItensSaidaComissao: ProdutoItem[] = [];
  vendaItensSaidaGasto: ProdutoItem[] = [];

  valorPrevistoDisabled = true;

  templateModalPrevisaoService = new TemplateModalService();
  previsaoVendaComponent = PrevisaoVendaComponent;

  templateModalRecebimentosService = new TemplateModalService();
  recebimentosVendaComponent = RecebimentosVendaComponent;

  templateModalPagamentosService = new TemplateModalService();
  pagamentosVendaComponent = PagamentosVendaComponent;
  inputs: any;
  tituloModal = '';
  componentModal: any;

  idVenda: number;

  constructor(private vendaService: VendaService,
              private recebimentoService: RecebimentoService) {
    this.vendaService.atualizaFinanceiroVenda.subscribe((venda: Venda) => {
      this.venda = venda;
      this.carregarFinanceiro();
    });
  }

  ngOnInit() {
    this.idVenda = this.venda.id;
    this.carregarFinanceiro();
  }

  carregarFinanceiro() {
    this.vendaItensEntrada = [];
    this.vendaItensSaidaComissao = [];
    this.vendaItensSaidaGasto = [];

    if (this.venda) {
      if (this.venda.vendaProdutos) {
        this.vendaItensEntrada = this.venda.vendaProdutos[0].produtos.itens.filter(item => item.tipoItem === 'RECEITA');
        this.vendaItensEntrada.forEach(item => {
          item.vendaValorPrevisto = this.venda.vendaValorPrevisto.filter(c => c.produtosItensId === item.id)[0];
          item.vendaValorRealizado = this.venda.vendaValorRealizado.filter(c => c.produtosItensId === item.id);
        });

        this.vendaItensSaidaComissao = this.venda.vendaProdutos[0].produtos.itens.filter(
          item => item.tipoItem === 'DESPESA' && item.subTipoItem === 'COMISSÃO');
        this.vendaItensSaidaComissao.forEach(item => {
          item.vendaValorPrevisto = this.venda.vendaValorPrevisto.filter(c => c.produtosItensId === item.id)[0];
          item.vendaValorRealizado = this.venda.vendaValorRealizado.filter(c => c.produtosItensId === item.id);
        });

        this.vendaItensSaidaGasto = this.venda.vendaProdutos[0].produtos.itens.filter(
          item => item.tipoItem === 'DESPESA' && item.subTipoItem === 'GASTO');
        this.vendaItensSaidaGasto.forEach(item => {
          item.vendaValorPrevisto = this.venda.vendaValorPrevisto.filter(c => c.produtosItensId === item.id)[0];
          item.vendaValorRealizado = this.venda.vendaValorRealizado.filter(c => c.produtosItensId === item.id);
        });
      }
    }
  }

  verificarPagamento(ValorRealizado: any): boolean {
    if (ValorRealizado) {
      if (ValorRealizado.length > 0) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  verificarPrevisto(vendaValorPrevisto: any): boolean {
    if (vendaValorPrevisto) {
      return true;
    }
    return false;
  }

  verificarValorPrevistoMaiorZero(vendaValorPrevisto: any): boolean {
    if (vendaValorPrevisto) {
      if (vendaValorPrevisto.valor > 0) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  abrirPagamentosVenda(produtoItemInput: ProdutoItem) {
    this.tituloModal =  `Previsão - ${produtoItemInput.descricao}`;
    this.componentModal = this.pagamentosVendaComponent;
    this.venda = Object.assign(this.venda, {id: this.idVenda });
    this.inputs = Object.assign({produtoItem: produtoItemInput, venda: this.venda});
    this.templateModalPagamentosService.setTemplateModalStatus(true);
  }

  abrirRecebimentosVenda(produtoItemInput: ProdutoItem) {
    this.tituloModal =  `Recebimentos - ${produtoItemInput.descricao}`;
    this.componentModal = this.recebimentosVendaComponent;
    this.venda = Object.assign(this.venda, {id: this.idVenda });
    this.inputs = Object.assign({produtoItem: produtoItemInput, venda: this.venda});
    this.templateModalRecebimentosService.setTemplateModalStatus(true);
  }

  abrirPrevisaoVenda(produtoItemInput: ProdutoItem) {
    this.tituloModal =  `Pagamentos - ${produtoItemInput.descricao}`;
    this.componentModal = this.previsaoVendaComponent;
    this.venda = Object.assign(this.venda, {id: this.idVenda });
    this.inputs = Object.assign({produtoItem: produtoItemInput, venda: this.venda});
    this.templateModalPrevisaoService.setTemplateModalStatus(true);
  }

  getTemplateModalPagamentosVenda() {
    return this.templateModalPagamentosService.getTemplateModalStatus();
  }

  getTemplateModalRecebimentosVenda() {
    return this.templateModalRecebimentosService.getTemplateModalStatus();
  }

  getTemplateModalPrevisaoVenda() {
    return this.templateModalPrevisaoService.getTemplateModalStatus();
  }

}
