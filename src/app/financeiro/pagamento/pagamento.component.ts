import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Pagamentos } from 'src/app/_models/Financeiro/Pagamentos/Pagamentos';
import { PagamentoParcelas } from 'src/app/_models/Financeiro/Pagamentos/PagamentoParcelas';
import { ToastrService } from 'ngx-toastr';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { PagamentoService } from 'src/app/_services/Financeiro/Pagamentos/pagamento.service';
import { Permissao } from 'src/app/_models/Permissoes/permissao';

@Component({
  selector: 'app-pagamento',
  templateUrl: './pagamento.component.html'
})
export class PagamentoComponent implements OnInit, AfterViewInit {

  novo = false;
  editar = false;
  visualizar = false;

  pagamentos: Pagamentos[];

  paginaAtual = 1;
  totalRegistros = 0; number;

  parcelas: PagamentoParcelas[] = [];

  idDetalharPagamento: number;

  constructor(private toastr: ToastrService,
              private permissaoService: PermissaoService,
              private pagamentoService: PagamentoService) { }

  ngOnInit() {
    this.pagamentoService.setDetalharPagamentoStatus(false);
    this.getPagamentos();
  }

  ngAfterViewInit() {
    this.permissaoService.getPermissoesByFormulario(
      Object.assign({formulario: 'PAGAMENTOS'})).subscribe((_PERMISSOES: Permissao[]) => {
      this.novo = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'NOVO')[0]);
      this.editar = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'EDITAR')[0]);
      this.visualizar = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'VISUALIZAR')[0]);
    });
  }

  getPagamentos() {
    this.pagamentoService.getAllPagamentos().subscribe(
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
