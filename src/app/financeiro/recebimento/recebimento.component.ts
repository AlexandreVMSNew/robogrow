import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Recebimentos } from 'src/app/_models/Financeiro/Recebimentos/Recebimentos';
import { BsLocaleService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { RecebimentoService } from 'src/app/_services/Financeiro/Recebimentos/recebimento.service';
import { Permissao } from 'src/app/_models/Permissoes/permissao';
import { RecebimentoParcelas } from 'src/app/_models/Financeiro/Recebimentos/RecebimentoParcelas';

@Component({
  selector: 'app-recebimento',
  templateUrl: './recebimento.component.html'
})
export class RecebimentoComponent implements OnInit, AfterViewInit {

  novo = false;
  visualizar = false;

  recebimentos: Recebimentos[];

  paginaAtual = 1;
  totalRegistros: number;

  parcelas: RecebimentoParcelas[] = [];

  idDetalharRecebimento: number;

  constructor(private toastr: ToastrService,
              private permissaoService: PermissaoService,
              private recebimentoService: RecebimentoService) { }

  ngOnInit() {
    this.recebimentoService.setDetalharRecebimentoStatus(false);
    this.getRecebimentos();
  }

  ngAfterViewInit() {
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('RECEBIMENTOS', 'NOVO').subscribe((_PERMISSAO: Permissao) => {
      this.novo = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('RECEBIMENTOS', 'VISUALIZAR').subscribe((_PERMISSAO: Permissao) => {
      this.visualizar = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
  }

  getRecebimentos() {
    this.recebimentoService.getAllRecebimentos().subscribe(
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

getDetalharRecebimento() {
  return this.recebimentoService.getDetalharRecebimentoStatus();
}

abrirTemplateDetalharRecebimento(idRecebimento: number) {
  this.idDetalharRecebimento = idRecebimento;
  this.recebimentoService.setDetalharRecebimentoStatus(true);
}

getTemplateRecebimento() {
  return this.recebimentoService.getTemplateRecebimentoStatus();
}

abrirTemplateRecebimento() {
  this.recebimentoService.setTemplateRecebimentoStatus(true);

}


}
