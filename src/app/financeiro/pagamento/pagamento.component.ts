import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Pagamentos } from 'src/app/_models/Financeiro/Pagamentos/Pagamentos';
import { PagamentoParcelas } from 'src/app/_models/Financeiro/Pagamentos/PagamentoParcelas';
import { ToastrService } from 'ngx-toastr';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { PagamentoService } from 'src/app/_services/Financeiro/Pagamentos/pagamento.service';
import { Permissao } from 'src/app/_models/Permissoes/permissao';
import { TemplateModalService } from 'src/app/_services/Uteis/TemplateModal/templateModal.service';
import { DetalharPagamentoComponent } from './detalharPagamento/detalharPagamento.component';
import { TemplatePagamentoComponent } from './templatePagamento/templatePagamento.component';
import { ProdutoItem } from 'src/app/_models/Cadastros/Produtos/produtoItem';

@Component({
  selector: 'app-pagamento',
  templateUrl: './pagamento.component.html'
})
export class PagamentoComponent implements OnInit, AfterViewInit {

  cadastrar = false;
  editar = false;
  visualizar = false;

  pagamentos: Pagamentos[];

  paginaAtual = 1;
  totalRegistros = 0; number;

  parcelas: PagamentoParcelas[] = [];

  idDetalharPagamento: number;

  templateModalDetalharPagamentoService = new TemplateModalService();
  detalharPagamentoComponent = DetalharPagamentoComponent;

  templateModalPagamentoService = new TemplateModalService();
  templatePagamentoComponent = TemplatePagamentoComponent;
  inputs: any;
  tituloModal = '';
  componentModal: any;

  constructor(private toastr: ToastrService,
              private permissaoService: PermissaoService,
              private pagamentoService: PagamentoService) { }

  ngOnInit() {
    this.pagamentoService.setDetalharPagamentoStatus(false);
    this.getPagamentos();
  }

  ngAfterViewInit() {
    
  }

  getPagamentos() {
    this.pagamentoService.getPagamentos().subscribe(
      // tslint:disable-next-line:variable-name
      (_PAGAMENTOS: Pagamentos[]) => {
      this.pagamentos = _PAGAMENTOS;

      this.pagamentos.forEach((pagamento) => {
        pagamento.parcelas.forEach(parcela => {

          parcela = Object.assign(parcela, {
            pessoas: pagamento.pessoas,
            dataEmissao: pagamento.dataEmissao,
            valorTotal: pagamento.valorTotal,
            valorRestante: parcela.valor - parcela.valorPago,
            centroDespesaId: pagamento.centroDespesaId,
            planoContasId: pagamento.planoContasId
          });

          this.parcelas.push(parcela);
        });
      });

    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Pagamentos: ${error.error}`);
    });
  }

  getTemplateModalDetalharPagamento() {
    return this.templateModalDetalharPagamentoService.getTemplateModalStatus();
  }

  abrirTemplateModalDetalharPagamento(recebimentoInput: Pagamentos) {
    this.tituloModal =  `Pagamento - ${recebimentoInput.produtosItens.descricao}`;
    this.componentModal = this.detalharPagamentoComponent;
    this.inputs = Object.assign({recebimento: recebimentoInput});
    this.templateModalDetalharPagamentoService.setTemplateModalStatus(true);
  }

  getTemplateModalPagamento() {
    return this.templateModalPagamentoService.getTemplateModalStatus();
  }

  abrirTemplateModalPagamento() {
    this.tituloModal =  `Pagamento`;
    this.componentModal = this.templatePagamentoComponent;
    this.inputs = Object.assign({});
    this.templateModalPagamentoService.setTemplateModalStatus(true);
  }


}
