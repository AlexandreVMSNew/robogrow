import { Component, OnInit, Input } from '@angular/core';
import { VendaService } from 'src/app/_services/Movimentos/Venda/venda.service';
import { Pagamentos } from 'src/app/_models/Financeiro/Pagamentos/Pagamentos';
import { ToastrService } from 'ngx-toastr';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { PagamentoService } from 'src/app/_services/Financeiro/Pagamentos/pagamento.service';
import { ProdutoItem } from 'src/app/_models/Cadastros/Produtos/produtoItem';

@Component({
  selector: 'app-pagamentos-venda',
  templateUrl: './pagamentosVenda.component.html',
  styleUrls: ['./pagamentosVenda.component.css']
})

export class PagamentosVendaComponent implements OnInit {

  @Input() produtoItem: ProdutoItem;
  @Input() idVenda: number;
  @Input() vendaClienteId: number;

  pagamentos: Pagamentos[];

  idDetalharPagamento: number;

  templateEnabled = false;

  constructor(private vendaService: VendaService,
              private toastr: ToastrService,
              private permissaoService: PermissaoService,
              private pagamentoService: PagamentoService) {
                this.vendaService.atualizaVenda.subscribe(x => {
                  this.getPagamentos();
                });
               }

  ngOnInit() {
    this.getPagamentos();
  }

  getPagamentos() {
    this.pagamentoService.getAllPagamentos().subscribe(
      // tslint:disable-next-line:variable-name
      (_PAGAMENTOS: Pagamentos[]) => {
        this.pagamentos = _PAGAMENTOS.filter(c => c.produtosItensId === this.produtoItem.id && c.vendaId === this.idVenda);
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Pagamentos: ${error.error}`);
    });
  }

  abrirTemplate(template: any) {
    if (this.templateEnabled === false) {
      this.templateEnabled = true;
      template.show();
    }
  }

  fecharTemplate(template: any) {
    template.hide();
    this.vendaService.setPagamentosVendaStatus(false);
    this.templateEnabled = false;
  }

  getDetalharPagamento() {
    return this.pagamentoService.getDetalharPagamentoStatus();
  }

  abrirTemplateDetalharPagamento(idPagamento: number) {
    this.idDetalharPagamento = idPagamento;
    this.pagamentoService.setDetalharPagamentoStatus(true);
  }

  getTemplatePagamento() {
    return this.pagamentoService.getTemplatePagamentoStatus();
  }

  abrirTemplatePagamento() {
    this.pagamentoService.setTemplatePagamentoStatus(true);
  }

}
