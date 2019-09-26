import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProdutoService } from 'src/app/_services/Cadastros/Produtos/produto.service';
import { ActivatedRoute } from '@angular/router';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { Produto } from 'src/app/_models/Cadastros/Produtos/produto';
import { ProdutoItem } from 'src/app/_models/Cadastros/Produtos/produtoItem';
import { CentroReceitaService } from 'src/app/_services/Cadastros/CentroReceita/centroReceita.service';
import { PlanoContaService } from 'src/app/_services/Cadastros/PlanosConta/planoConta.service';
import { CentroDespesaService } from 'src/app/_services/Cadastros/CentroDespesa/centroDespesa.service';
import { ProdutoGrupoChecks } from 'src/app/_models/Cadastros/Produtos/produtoGrupoChecks';

@Component({
  selector: 'app-editar-produto',
  templateUrl: './editarProduto.component.html'
})
export class EditarProdutoComponent implements OnInit {

  cadastroForm: FormGroup;

  produto: Produto;
  idProduto: number;

  produtoItens: ProdutoItem[] = [];
  produtoItem: ProdutoItem;

  produtoGrupoChecks: ProdutoGrupoChecks[] = [];
  grupoChecks: ProdutoGrupoChecks;

  modoSalvar = '';

  constructor(public fb: FormBuilder,
              private toastr: ToastrService,
              private produtoService: ProdutoService,
              public router: ActivatedRoute,
              private changeDetectionRef: ChangeDetectorRef,
              public permissaoService: PermissaoService) {
                this.produtoService.atualizaProdutos.subscribe(x => {
                  this.carregarProduto();
                }); }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewChecked() {
    this.changeDetectionRef.detectChanges();
  }

  ngOnInit() {
    this.idProduto = +this.router.snapshot.paramMap.get('id');
    this.validarForm();
    this.carregarProduto();
  }

  carregarProduto() {
    this.produtoService.getProdutoById(this.idProduto)
    .subscribe((produto: Produto) => {
      this.produto = Object.assign({}, produto);
      this.cadastroForm.patchValue(this.produto);

      this.produtoItens = [];
      this.produtoItens = produto.itens;
      this.produtoGrupoChecks = produto.grupoChecks;
      this.produtoService.atualizarProdutosGruposCheck();
    }, error => {
      this.toastr.error(`Erro ao tentar carregar Produto: ${error.error}`);
      console.log(error);
    });
  }

  validarForm() {
    this.cadastroForm = this.fb.group({
        id:  [''],
        descricao: ['', Validators.required],
        valorMinimo: ['', [Validators.required, Validators.min(1)]],
    });
  }


  abrirCheckListProduto(modoSalvar: string, grupoChecks: ProdutoGrupoChecks) {
    this.modoSalvar = modoSalvar;
    this.grupoChecks = grupoChecks;
    this.produtoService.setCheckListProdutoStatus(true);
  }

  getCheckListProduto() {
    return this.produtoService.getCheckListProdutoStatus();
  }

  abrirProdutoItens(modoSalvar: string, produtoItem: ProdutoItem) {
    this.modoSalvar = modoSalvar;
    this.produtoItem = produtoItem;
    this.produtoService.setProdutoItensStatus(true);
  }

  getProdutoItens() {
    return this.produtoService.getProdutoItensStatus();
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

}
