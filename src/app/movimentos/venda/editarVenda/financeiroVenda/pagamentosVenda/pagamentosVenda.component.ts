import { Component, OnInit, Input } from '@angular/core';
import { VendaService } from 'src/app/_services/Movimentos/Venda/venda.service';
import { Pagamentos } from 'src/app/_models/Financeiro/Pagamentos/Pagamentos';
import { ToastrService } from 'ngx-toastr';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { PagamentoService } from 'src/app/_services/Financeiro/Pagamentos/pagamento.service';
import { ProdutoItem } from 'src/app/_models/Cadastros/Produtos/produtoItem';
import { Venda } from 'src/app/_models/Movimentos/Venda/Venda';
import { TemplateModalService } from 'src/app/_services/Uteis/TemplateModal/templateModal.service';
import { DetalharPagamentoComponent } from 'src/app/financeiro/pagamento/detalharPagamento/detalharPagamento.component';
import { TemplatePagamentoComponent } from 'src/app/financeiro/pagamento/templatePagamento/templatePagamento.component';

@Component({
  selector: 'app-pagamentos-venda',
  templateUrl: './pagamentosVenda.component.html',
  styleUrls: ['./pagamentosVenda.component.css']
})

export class PagamentosVendaComponent implements OnInit {

  @Input() produtoItem: ProdutoItem;
  @Input() venda: Venda;

  pagamentos: Pagamentos[];


  templateEnabled = false;

  templateModalDetalharPagamentoService = new TemplateModalService();
  detalharPagamentoComponent = DetalharPagamentoComponent;

  templateModalPagamentoService = new TemplateModalService();
  templatePagamentoComponent = TemplatePagamentoComponent;
  inputs: any;
  tituloModal = '';
  componentModal: any;

  constructor(private vendaService: VendaService,
              private toastr: ToastrService,
              private pagamentoService: PagamentoService) {
                this.vendaService.atualizaVenda.subscribe(x => {
                  this.getPagamentos();
                });
               }

  ngOnInit() {
    this.getPagamentos();
  }

  getPagamentos() {
    this.pagamentoService.getPagamentos().subscribe(
      (_PAGAMENTOS: Pagamentos[]) => {
        this.pagamentos = _PAGAMENTOS.filter(c => c.produtosItensId === this.produtoItem.id && c.vendaId === this.venda.id);
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Pagamentos: ${error.error}`);
    });
  }


  getTemplateModalDetalharPagamento() {
    return this.templateModalDetalharPagamentoService.getTemplateModalStatus();
  }

  abrirTemplateModalDetalharPagamento(idPagamentoInput: number, produtoItemInput: ProdutoItem) {
    this.tituloModal =  `Pagamento - ${produtoItemInput.descricao}`;
    this.componentModal = this.detalharPagamentoComponent;
    this.inputs = Object.assign({produtoItem: produtoItemInput, idPagamento: idPagamentoInput});
    this.templateModalDetalharPagamentoService.setTemplateModalStatus(true);
  }

  getTemplateModalPagamento() {
    return this.templateModalPagamentoService.getTemplateModalStatus();
  }

  abrirTemplateModalPagamento(produtoItemInput: ProdutoItem) {
    this.tituloModal =  `Pagamento - ${produtoItemInput.descricao}`;
    this.componentModal = this.templatePagamentoComponent;
    this.inputs = Object.assign({produtoItem: produtoItemInput, venda: this.venda});
    this.templateModalPagamentoService.setTemplateModalStatus(true);
  }

}
