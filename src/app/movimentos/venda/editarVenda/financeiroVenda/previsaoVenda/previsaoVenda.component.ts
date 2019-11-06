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
  templateUrl: './previsaoVenda.component.html'
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

  modoSalvar = '';
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
          (this.venda.status === 'EM NEGOCIAÇÃO') ? this.valorPrevistoDisabled = true : this.valorPrevistoDisabled = false;
          this.modoSalvar = 'EDITAR';
          this.valorPrevisto = Object.assign({}, _VALORPREVISTO);
          this.cadastroValorPrevistoForm.patchValue(this.valorPrevisto);
        } else {
          this.modoSalvar = 'CADASTRAR';
          this.valorPrevisto = null;
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
        vendaId: [''],
        produtosItensId: [''],
        valor: ['', [Validators.required, Validators.min(this.valorMinimoProduto)]]
    });
  }

  cadastrarValorPrevisto() {
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    this.valorPrevisto = Object.assign(this.cadastroValorPrevistoForm.value,
       {id: 0, vendaId: this.venda.id, produtosItensId: this.produtoItem.id, dataHoraUltAlt: dataAtual});
    this.vendaService.cadastrarVendaValorPrevisto(this.valorPrevisto).subscribe(
      () => {
        this.carregarPrevisao();
        this.vendaService.atualizarVenda();
        this.toastr.success('Cadastrado com Sucesso!');
      }, error => {
        console.log(error.error);
      }
    );
  }

  editarValorPrevisto() {
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    this.valorPrevisto = Object.assign(this.cadastroValorPrevistoForm.value,
       {dataHoraUltAlt: dataAtual});
       console.log(this.valorPrevisto);
    this.vendaService.editarVendaValorPrevisto(this.valorPrevisto).subscribe(
      () => {
        this.carregarPrevisao();
        this.vendaService.atualizarVenda();
        this.toastr.success('Editado com Sucesso!');
      }, error => {
        console.log(error.error);
      }
    );
  }

}
