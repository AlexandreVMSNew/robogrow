import { Component, OnInit, Input } from '@angular/core';
import { Venda } from 'src/app/_models/Movimentos/Venda/Venda';
import { VendaService } from 'src/app/_services/Movimentos/Venda/venda.service';
import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';
import * as moment from 'moment';
import { VendaValorPrevisto } from 'src/app/_models/Movimentos/Venda/VendaValorPrevisto';
import { VendaProduto } from 'src/app/_models/Movimentos/Venda/VendaProduto';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
@Component({
  selector: 'app-pedido-venda',
  templateUrl: './pedidoVenda.component.html',
  styleUrls: ['./pedidoVenda.component.css']
})
export class PedidoVendaComponent implements OnInit {

  @Input() venda: Venda;

  templateEnabled = false;
  dataHoraEmissao: any;
  valorTotal = 0;

  baseURLLogo = '';
  constructor(private vendaService: VendaService) { }

  ngOnInit() {
    this.dataHoraEmissao = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    this.carregarValorVenda();
  }

  carregarValorVenda() {
    if (this.venda) {
      this.baseURLLogo = InfoAPI.URL + '/api/empresas/' + this.venda.empresasId + '/logo/' + this.venda.empresas.nomeArquivoLogo;
    }
    this.venda.vendaValorPrevisto.forEach((valorPrevisto: VendaValorPrevisto) => {
      this.venda.vendaProdutos.forEach((vendaProduto: VendaProduto) => {
        const produtoItem = vendaProduto.produtos.itens.filter(c => c.id === valorPrevisto.produtosItensId);
        if (produtoItem.length > 0) {
          if (produtoItem[0].tipoItem === 'RECEITA') {
            this.valorTotal += valorPrevisto.valor;
          }
        }
      });
    });
  }

  gerarPedido() {
    const data = document.getElementById('pedido');
    html2canvas(data, {allowTaint : true, useCORS: true}).then(canvas => {
     const imgHeight = canvas.height * 208 / canvas.width;
     const contentDataURL = canvas.toDataURL('image/jpeg');
     const pdf = new jsPDF();
     pdf.addImage(contentDataURL, 'JPEG', 0, 0, 208, imgHeight);
     pdf.output('dataurlnewwindow');
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
    this.templateEnabled = false;
    this.vendaService.setPedidoVendaStatus(false);
  }

}
