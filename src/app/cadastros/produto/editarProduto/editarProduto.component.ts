import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProdutoService } from 'src/app/_services/Cadastros/Produtos/produto.service';
import { ActivatedRoute } from '@angular/router';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { Produto } from 'src/app/_models/Cadastros/Produtos/produto';
import { ProdutoItem } from 'src/app/_models/Cadastros/Produtos/produtoItem';
import { CentroDespesa } from 'src/app/_models/Cadastros/CentroDespesa/centroDespesa';
import { CentroReceita } from 'src/app/_models/Cadastros/CentroReceita/CentroReceita';
import { PlanoContas } from 'src/app/_models/Cadastros/PlanoContas/planoContas';
import { CentroReceitaService } from 'src/app/_services/Cadastros/CentroReceita/centroReceita.service';
import { PlanoContaService } from 'src/app/_services/Cadastros/PlanosConta/planoConta.service';
import { CentroDespesaService } from 'src/app/_services/Cadastros/CentroDespesa/centroDespesa.service';

@Component({
  selector: 'app-editar-produto',
  templateUrl: './editarProduto.component.html'
})
export class EditarProdutoComponent implements OnInit {

  cadastroForm: FormGroup;
  cadastroItemForm: FormGroup;

  produto: Produto;
  idProduto: number;

  tipos = ['RECEITA', 'DESPESA'];
  tipoSelecionado: string;

  centrosReceita: CentroReceita[];
  centroReceitaIdSelecionado: string;

  centrosDespesa: CentroDespesa[];
  centroDespesaIdSelecionado: string;

  planoContasReceita: PlanoContas[];
  planoContasDespesa: PlanoContas[];
  planoContasIdSelecionado: string;

  subTipos = ['COMISSÃO', 'GASTO'];
  subTipoSelecionado: string;

  produtoItens: ProdutoItem[] = [];
  novosItem: ProdutoItem[] = [];
  idItemEdit: number;

  modoSalvar = '';

  constructor(public fb: FormBuilder,
              private toastr: ToastrService,
              private produtoService: ProdutoService,
              public router: ActivatedRoute,
              private changeDetectionRef: ChangeDetectorRef,
              private centroReceitaService: CentroReceitaService,
              private centroDespesaService: CentroDespesaService,
              private planoContaService: PlanoContaService,
              public permissaoService: PermissaoService) { }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewChecked() {
    this.changeDetectionRef.detectChanges();
  }

  ngOnInit() {
    this.idProduto = +this.router.snapshot.paramMap.get('id');
    this.validarForm();
    this.validarItemForm();
    this.carregarProduto();
    this.getCentroDespesa();
    this.getCentroReceita();
    this.getPlanoContas();
  }

  carregarProduto() {
    this.produtoService.getProdutoById(this.idProduto)
    .subscribe((produto: Produto) => {
      this.produto = Object.assign({}, produto);
      this.cadastroForm.patchValue(this.produto);

      this.produtoItens = [];
      this.produtoItens = produto.itens;

    }, error => {
      this.toastr.error(`Erro ao tentar carregar Produto: ${error.error}`);
      console.log(error);
    });
  }

  validarForm() {
    this.cadastroForm = this.fb.group({
        id:  [''],
        descricao: ['', Validators.required]
    });
  }

  validarItemForm() {
    this.cadastroItemForm = this.fb.group({
        id:  [''],
        produtosId: [''],
        tipoItem: ['', Validators.required],
        subTipoItem: [''],
        descricao: ['', Validators.required],
        centroDespesaId: ['', ],
        centroReceitaId: [''],
        planoContasId: ['', Validators.required]
    });
  }

  adicionarItem(template: any) {

    if (this.cadastroItemForm.get('tipoItem').value === 'RECEITA') {
      this.cadastroItemForm.get('subTipoItem').setValue(null);
    }

    if (this.modoSalvar === 'novo') {
      this.novosItem.push(Object.assign(this.cadastroItemForm.value, {id: 0, produtosId: this.idProduto}));
      if (this.novosItem.length > 0) {
        this.produtoService.novoItem(this.novosItem).subscribe(() => {
          this.cadastroItemForm.reset();
          this.carregarProduto();
          this.toastr.success('Item Cadastrado com sucesso!');
        });
      }
      this.novosItem = [];
    } else {
      const item = Object.assign(this.cadastroItemForm.value);

      this.produtoService.editarItem(item, this.idItemEdit).subscribe(
        () => {
          this.cadastroItemForm.reset();
          this.carregarProduto();
          this.toastr.success('Editado com sucesso!');
        });
    }
    template.hide();
  }

  editarItem(template: any, Item: any) {
    this.modoSalvar = 'editar';
    this.idItemEdit = Item.id;
    this.cadastroItemForm.patchValue(Item);
    this.planoContasIdSelecionado = Item.planoContasId;
    this.centroDespesaIdSelecionado = Item.centroDespesaId;
    this.centroReceitaIdSelecionado = Item.centroReceitaId;
    this.subTipoSelecionado = Item.subTipoItem;
    template.show();
  }

  novoItem(template: any) {
    this.modoSalvar = 'novo';
    this.cadastroItemForm.reset();
    this.tipoSelecionado = null;
    this.subTipoSelecionado = null;
    template.show();
  }

  salvarAlteracoes() {
    this.produto = Object.assign({ id: this.produto.id }, this.cadastroForm.value);

    this.produtoService.editarProduto(this.produto).subscribe(
      () => {
        this.toastr.success('Editado com sucesso!');
        this.carregarProduto();
      }, error => {
        this.toastr.error(`Erro ao tentar Editar: ${error.error}`);
        console.log(error.error);
      });
  }

  getPlanoContas() {
    this.planoContaService.getAllPlanosConta().subscribe(
      (_PLANOS: PlanoContas[]) => {
      this.planoContasReceita = _PLANOS.filter(c => c.tipo === 'RECEITA' && c.categoria === 'ANALÍTICA');
      this.planoContasDespesa = _PLANOS.filter(c => c.tipo === 'DESPESA' && c.categoria === 'ANALÍTICA');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Planos de Contas: ${error.error}`);
    });
  }

  getCentroReceita() {
    this.centroReceitaService.getAllCentroReceita().subscribe(
      (_CENTROS: CentroReceita[]) => {
      this.centrosReceita = _CENTROS.filter(c => c.status !== 'INATIVO');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Centros de Receita: ${error.error}`);
    });
  }

  getCentroDespesa() {
    this.centroDespesaService.getAllCentroDespesa().subscribe(
      (_CENTROS: CentroDespesa[]) => {
      this.centrosDespesa = _CENTROS.filter(c => c.status !== 'INATIVO');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Centros de Despesa: ${error.error}`);
    });
  }

}
