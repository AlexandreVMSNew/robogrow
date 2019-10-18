import { Component, OnInit, Input } from '@angular/core';
import { ProdutoItem } from 'src/app/_models/Cadastros/Produtos/produtoItem';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ProdutoService } from 'src/app/_services/Cadastros/Produtos/produto.service';
import { ToastrService } from 'ngx-toastr';
import { Produto } from 'src/app/_models/Cadastros/Produtos/produto';
import { CentroReceita } from 'src/app/_models/Cadastros/CentroReceita/CentroReceita';
import { CentroDespesa } from 'src/app/_models/Cadastros/CentroDespesa/CentroDespesa';
import { PlanoContas } from 'src/app/_models/Cadastros/PlanoContas/planoContas';
import { CentroDespesaService } from 'src/app/_services/Cadastros/CentroDespesa/centroDespesa.service';
import { CentroReceitaService } from 'src/app/_services/Cadastros/CentroReceita/centroReceita.service';
import { PlanoContaService } from 'src/app/_services/Cadastros/PlanosConta/planoConta.service';

@Component({
  selector: 'app-template-produto-itens',
  templateUrl: './templateProdutoItens.component.html',
  styleUrls: ['./templateProdutoItens.component.css']
})
export class TemplateProdutoItensComponent implements OnInit {

  @Input() produto: Produto;
  @Input() produtoItem: ProdutoItem;
  @Input() modoSalvar: string;

  cadastroItemForm: FormGroup;

  tipos = ['RECEITA', 'DESPESA'];
  tipoSelecionado: string;

  subTipos = ['COMISSÃO', 'GASTO'];
  subTipoSelecionado: string;

  centrosReceita: CentroReceita[];
  centroReceitaIdSelecionado: number;

  centrosDespesa: CentroDespesa[];
  centroDespesaIdSelecionado: number;

  planoContasReceita: PlanoContas[];
  planoContasDespesa: PlanoContas[];
  planoContasIdSelecionado: number;

  novosItem: ProdutoItem[] = [];


  templateEnabled = false;

  constructor(private produtoService: ProdutoService,
              public fb: FormBuilder,
              private toastr: ToastrService,
              private centroReceitaService: CentroReceitaService,
              private centroDespesaService: CentroDespesaService,
              private planoContaService: PlanoContaService) { }

  ngOnInit() {
    this.getCentroDespesa();
    this.getCentroReceita();
    this.getPlanoContas();
    this.validarItemForm();
    this.carregarItem();
  }

  validarItemForm() {
    this.cadastroItemForm = this.fb.group({
        id:  [''],
        produtosId: [''],
        tipoItem: ['', Validators.required],
        subTipoItem: [''],
        descricao: ['', Validators.required],
        centroDespesaId: [''],
        centroReceitaId: [''],
        planoContasId: ['', Validators.required]
    });
  }

  adicionarItem(template: any) {

    if (this.cadastroItemForm.get('tipoItem').value === 'RECEITA') {
      this.cadastroItemForm.get('subTipoItem').setValue(null);
    }

    if (this.modoSalvar === 'novo') {
      this.novosItem.push(Object.assign(this.cadastroItemForm.value, {id: 0, produtosId: this.produto.id}));
      if (this.novosItem.length > 0) {
        this.produtoService.novoItem(this.novosItem).subscribe(() => {
          this.cadastroItemForm.reset();
          this.produtoService.atualizarProdutos();
          this.toastr.success('Item Cadastrado com sucesso!');
        });
      }
      this.novosItem = [];
    } else {
      const item = Object.assign(this.cadastroItemForm.value);

      this.produtoService.editarItem(item, this.produtoItem.id).subscribe(
        () => {
          this.cadastroItemForm.reset();
          this.produtoService.atualizarProdutos();
          this.toastr.success('Editado com sucesso!');
        });
    }
    this.fecharTemplate(template);
  }

  carregarItem() {
      if (this.modoSalvar === 'editar') {
      this.cadastroItemForm.patchValue(this.produtoItem);
      this.tipoSelecionado = this.produtoItem.tipoItem;
      this.subTipoSelecionado = this.produtoItem.subTipoItem;
      this.planoContasIdSelecionado = this.produtoItem.planoContasId;
      this.centroDespesaIdSelecionado = this.produtoItem.centroDespesaId;
      this.centroReceitaIdSelecionado = this.produtoItem.centroReceitaId;
    }
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
    this.produtoService.setProdutoItensStatus(false);
  }

  getPlanoContas() {
    this.planoContaService.getPlanosConta().subscribe(
      (_PLANOS: PlanoContas[]) => {
      this.planoContasReceita = _PLANOS.filter(c => c.tipo === 'RECEITA' && c.categoria === 'ANALÍTICA');
      this.planoContasDespesa = _PLANOS.filter(c => c.tipo === 'DESPESA' && c.categoria === 'ANALÍTICA');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Planos de Contas: ${error.error}`);
    });
  }

  getCentroReceita() {
    this.centroReceitaService.getCentroReceita().subscribe(
      (_CENTROS: CentroReceita[]) => {
      this.centrosReceita = _CENTROS.filter(c => c.status !== 'INATIVO');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Centros de Receita: ${error.error}`);
    });
  }

  getCentroDespesa() {
    this.centroDespesaService.getCentroDespesa().subscribe(
      (_CENTROS: CentroDespesa[]) => {
      this.centrosDespesa = _CENTROS.filter(c => c.status !== 'INATIVO');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Centros de Despesa: ${error.error}`);
    });
  }


}
