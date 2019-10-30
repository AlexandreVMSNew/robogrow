import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Recebimentos } from 'src/app/_models/Financeiro/Recebimentos/Recebimentos';
import { BsLocaleService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { RecebimentoService } from 'src/app/_services/Financeiro/Recebimentos/recebimento.service';
import { Permissao } from 'src/app/_models/Permissoes/permissao';
import { RecebimentoParcelas } from 'src/app/_models/Financeiro/Recebimentos/RecebimentoParcelas';
import { ProdutoItem } from 'src/app/_models/Cadastros/Produtos/produtoItem';
import { TemplateModalService } from 'src/app/_services/Uteis/TemplateModal/templateModal.service';
import { DetalharRecebimentoComponent } from './detalharRecebimento/detalharRecebimento.component';
import { TemplateRecebimentoComponent } from './templateRecebimento/templateRecebimento.component';

@Component({
  selector: 'app-recebimento',
  templateUrl: './recebimento.component.html'
})
export class RecebimentoComponent implements OnInit, AfterViewInit {

  cadastrar = false;
  visualizar = false;

  recebimentos: Recebimentos[];

  paginaAtual = 1;
  totalRegistros = 0; number;

  parcelas: RecebimentoParcelas[] = [];

  templateModalDetalharRecebimentoService = new TemplateModalService();
  detalharRecebimentoComponent = DetalharRecebimentoComponent;

  templateModalRecebimentoService = new TemplateModalService();
  templateRecebimentoComponent = TemplateRecebimentoComponent;
  inputs: any;
  tituloModal = '';
  componentModal: any;

  constructor(private toastr: ToastrService,
              private permissaoService: PermissaoService,
              private recebimentoService: RecebimentoService) { }

  ngOnInit() {
    this.recebimentoService.setDetalharRecebimentoStatus(false);
    this.getRecebimentos();
  }

  ngAfterViewInit() {
    
  }

  getRecebimentos() {
    this.recebimentoService.getRecebimentos().subscribe(
      // tslint:disable-next-line:variable-name
      (_RECEBIMENTOS: Recebimentos[]) => {
      this.recebimentos = _RECEBIMENTOS;

      this.recebimentos.forEach((recebimento) => {
        recebimento.parcelas.forEach(parcela => {

          parcela = Object.assign(parcela, {
            clientes: recebimento.clientes,
            dataEmissao: recebimento.dataEmissao,
            valorTotal: recebimento.valorTotal,
            valorRestante: parcela.valor - parcela.valorRecebido,
            centroReceitaId: recebimento.centroReceitaId,
            planoContasId: recebimento.planoContasId
          });

          this.parcelas.push(parcela);
        });
      });

    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Recebimentos: ${error.error}`);
    });
  }

  getTemplateModalDetalharRecebimento() {
    return this.templateModalDetalharRecebimentoService.getTemplateModalStatus();
  }

  abrirTemplateModalDetalharRecebimento(recebimentoInput: Recebimentos) {
    this.tituloModal =  `Pagamento - ${recebimentoInput.produtosItens.descricao}`;
    this.componentModal = this.detalharRecebimentoComponent;
    this.inputs = Object.assign({recebimento: recebimentoInput});
    this.templateModalDetalharRecebimentoService.setTemplateModalStatus(true);
  }

  getTemplateModalRecebimento() {
    return this.templateModalRecebimentoService.getTemplateModalStatus();
  }

  abrirTemplateModalRecebimento() {
    this.tituloModal =  `Recebimento`;
    this.componentModal = this.templateRecebimentoComponent;
    this.inputs = Object.assign({});
    this.templateModalRecebimentoService.setTemplateModalStatus(true);
  }


}
