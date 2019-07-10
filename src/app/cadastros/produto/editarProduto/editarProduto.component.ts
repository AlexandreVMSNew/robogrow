import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProdutoService } from 'src/app/_services/Cadastros/Produtos/produto.service';
import { ActivatedRoute } from '@angular/router';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { Produto } from 'src/app/_models/Cadastros/Produtos/produto';
import { ProdutoItem } from 'src/app/_models/Cadastros/Produtos/produtoItem';

@Component({
  selector: 'app-editar-produto',
  templateUrl: './editarProduto.component.html'
})
export class EditarProdutoComponent implements OnInit {

  cadastroForm: FormGroup;
  cadastroItemForm: FormGroup;

  produto: Produto;
  idProduto: number;

  tipos = ['ENTRADA', 'SAIDA'];
  tipoSelecionado: string;

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
        subTipoItem: ['', Validators.required],
        descricao: ['', Validators.required]
    });
  }

  adicionarItem(template: any) {

    if (this.cadastroItemForm.get('tipoItem').value === 'ENTRADA') {
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
}
