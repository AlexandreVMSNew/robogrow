import { Component, OnInit, Input } from '@angular/core';
import { ProdutoItem } from 'src/app/_models/Cadastros/Produtos/produtoItem';
import { VendaService } from 'src/app/_services/Movimentos/Venda/venda.service';
import { ToastrService } from 'ngx-toastr';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { RecebimentoService } from 'src/app/_services/Financeiro/Recebimentos/recebimento.service';
import { Recebimentos } from 'src/app/_models/Financeiro/Recebimentos/Recebimentos';
import { Venda } from 'src/app/_models/Movimentos/Venda/Venda';
import { TemplateModalService } from 'src/app/_services/Uteis/TemplateModal/templateModal.service';
import { TemplateRecebimentoComponent } from 'src/app/financeiro/recebimento/templateRecebimento/templateRecebimento.component';
import { DetalharRecebimentoComponent } from 'src/app/financeiro/recebimento/detalharRecebimento/detalharRecebimento.component';

@Component({
  selector: 'app-recebimentos-venda',
  templateUrl: './recebimentosVenda.component.html',
  styleUrls: ['./recebimentosVenda.component.css']
})
export class RecebimentosVendaComponent implements OnInit {

  @Input() produtoItem: ProdutoItem;
  @Input() venda: Venda;

  recebimentos: Recebimentos[];

  idDetalharRecebimento: number;

  templateEnabled = false;

  templateModalDetalharRecebimentoService = new TemplateModalService();
  detalharRecebimentoComponent = DetalharRecebimentoComponent;

  templateModalRecebimentoService = new TemplateModalService();
  templateRecebimentoComponent = TemplateRecebimentoComponent;
  inputs: any;
  tituloModal = '';
  componentModal: any;

  constructor(private vendaService: VendaService,
              private toastr: ToastrService,
              private recebimentoService: RecebimentoService) {
                this.vendaService.atualizaVenda.subscribe(x => {
                  this.getRecebimentos();
                });
               }

  ngOnInit() {
    this.getRecebimentos();
  }

  getRecebimentos() {
    this.recebimentoService.getRecebimentos().subscribe(
      // tslint:disable-next-line:variable-name
      (_RECEBIMENTOS: Recebimentos[]) => {
        this.recebimentos = _RECEBIMENTOS.filter(c => c.produtosItensId === this.produtoItem.id && c.vendaId === this.venda.id);
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Recebimentos: ${error.error}`);
    });
  }

  getTemplateModalDetalharRecebimento() {
    return this.templateModalDetalharRecebimentoService.getTemplateModalStatus();
  }

  abrirTemplateModalDetalharRecebimento(recebimentoInput: Recebimentos, produtoItemInput: ProdutoItem) {
    this.tituloModal =  `Recebimento - ${produtoItemInput.descricao}`;
    this.componentModal = this.detalharRecebimentoComponent;
    this.inputs = Object.assign({produtoItem: produtoItemInput, recebimento: recebimentoInput});
    this.templateModalDetalharRecebimentoService.setTemplateModalStatus(true);
  }

  getTemplateModalRecebimento() {
    return this.templateModalRecebimentoService.getTemplateModalStatus();
  }

  abrirTemplateModalRecebimento(produtoItemInput: ProdutoItem) {
    this.tituloModal =  `Recebimento - ${produtoItemInput.descricao}`;
    this.componentModal = this.templateRecebimentoComponent;
    this.inputs = Object.assign({produtoItem: produtoItemInput, venda: this.venda});
    this.templateModalRecebimentoService.setTemplateModalStatus(true);
  }

}
