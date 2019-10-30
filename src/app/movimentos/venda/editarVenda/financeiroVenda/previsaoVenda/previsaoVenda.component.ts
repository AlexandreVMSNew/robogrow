import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { VendaService } from 'src/app/_services/Movimentos/Venda/venda.service';
import { ProdutoItem } from 'src/app/_models/Cadastros/Produtos/produtoItem';
import { Venda } from 'src/app/_models/Movimentos/Venda/Venda';
import { VendaValorPrevisto } from 'src/app/_models/Movimentos/Venda/VendaValorPrevisto';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

@Component({
  selector: 'app-previsao-venda',
  templateUrl: './previsaoVenda.component.html',
  styleUrls: ['./previsaoVenda.component.css']
})
export class PrevisaoVendaComponent implements OnInit {

  @Input() produtoItem: ProdutoItem;
  @Input() venda: Venda;

  cadastroValorPrevistoForm: FormGroup;

  templateEnabled = false;

  valorPrevistoPipe: any;
  valorPrevisto: VendaValorPrevisto;

  valorMinimoProduto = 0;
  valorPrevistoDisabled = false;

  constructor(private vendaService: VendaService,
              private fb: FormBuilder,
              private toastr: ToastrService) { }

  ngOnInit() {
    if (this.venda && this.produtoItem) {
      if (this.produtoItem.tipoItem === 'RECEITA') {
        this.valorMinimoProduto = this.venda.vendaProdutos[0].produtos.valorMinimo;
      }
    }
    this.validarValorPrevistoForm();
    this.carregarPrevisao();
  }

  carregarPrevisao() {
    this.vendaService.getVendaValorPrevistoByProdIdVendId(this.produtoItem.id, this.venda.id).subscribe(
      (_VALORPREVISTO: VendaValorPrevisto) => {
        this.validarValorPrevistoForm();
        if (_VALORPREVISTO) {
          this.valorPrevistoDisabled = true;
          this.valorPrevisto = Object.assign({}, _VALORPREVISTO);
          this.cadastroValorPrevistoForm.patchValue(this.valorPrevisto);
        } else {
          this.valorPrevisto = null;
          this.valorPrevistoDisabled = false;
          this.cadastroValorPrevistoForm.patchValue({id: 0, valor: null});
        }

      }, error => {
        console.log(error.error);
      }
    );
  }

  validarValorPrevistoForm() {
    this.cadastroValorPrevistoForm = this.fb.group({
        id: [''],
        valor: ['', [Validators.required, Validators.min(this.valorMinimoProduto)]]
    });
  }

  salvarValorPrevisto() {
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    this.valorPrevisto = Object.assign(this.cadastroValorPrevistoForm.value,
       {id: 0, vendaId: this.venda.id, produtosItensId: this.produtoItem.id, dataHoraUltAlt: dataAtual});
    this.vendaService.cadastrarVendaValorPrevisto(this.valorPrevisto).subscribe(
      () => {
        this.vendaService.atualizarVenda();
        this.toastr.success('Salvo com Sucesso!');
      }, error => {
        console.log(error.error);
      }
    );
  }

}
