import { Component, OnInit, Input } from '@angular/core';
import { ProdutoItem } from 'src/app/_models/Cadastros/Produtos/produtoItem';
import { VendaService } from 'src/app/_services/Movimentos/Venda/venda.service';
import { ToastrService } from 'ngx-toastr';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { RecebimentoService } from 'src/app/_services/Financeiro/Recebimentos/recebimento.service';
import { Recebimentos } from 'src/app/_models/Financeiro/Recebimentos/Recebimentos';

@Component({
  selector: 'app-recebimentos-venda',
  templateUrl: './recebimentosVenda.component.html',
  styleUrls: ['./recebimentosVenda.component.css']
})
export class RecebimentosVendaComponent implements OnInit {

  @Input() produtoItem: ProdutoItem;
  @Input() idVenda: number;

  recebimentos: Recebimentos[];

  idDetalharRecebimento: number;

  templateEnabled = false;

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
    this.recebimentoService.getAllRecebimentos().subscribe(
      // tslint:disable-next-line:variable-name
      (_RECEBIMENTOS: Recebimentos[]) => {
        this.recebimentos = _RECEBIMENTOS.filter(c => c.produtosItensId === this.produtoItem.id && c.vendaId === this.idVenda);
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Recebimentos: ${error.error}`);
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
    this.vendaService.setRecebimentosVendaStatus(false);
    this.templateEnabled = false;
  }

  getDetalharRecebimento() {
    return this.recebimentoService.getDetalharRecebimentoStatus();
  }

  abrirTemplateDetalharRecebimento(idRecebimento: number) {
    this.idDetalharRecebimento = idRecebimento;
    console.log(this.idDetalharRecebimento);
    this.recebimentoService.setDetalharRecebimentoStatus(true);
  }

  getTemplateRecebimento() {
    return this.recebimentoService.getTemplateRecebimentoStatus();
  }

  abrirTemplateRecebimento() {
    this.recebimentoService.setTemplateRecebimentoStatus(true);
  }

}
