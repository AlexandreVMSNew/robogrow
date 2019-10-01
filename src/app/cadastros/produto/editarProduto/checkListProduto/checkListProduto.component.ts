import { Component, OnInit, Input } from '@angular/core';
import { ProdutoService } from 'src/app/_services/Cadastros/Produtos/produto.service';
import { ProdutoGrupoChecks } from 'src/app/_models/Cadastros/Produtos/produtoGrupoChecks';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProdutoCheckList } from 'src/app/_models/Cadastros/Produtos/produtoCheckList';
import { ProdutoCheckListOpcoes } from 'src/app/_models/Cadastros/Produtos/ProdutoCheckListOpcoes';
import { Produto } from 'src/app/_models/Cadastros/Produtos/produto';

@Component({
  selector: 'app-check-list-produto',
  templateUrl: './checkListProduto.component.html',
  styleUrls: ['./checkListProduto.component.css']
})
export class CheckListProdutoComponent implements OnInit {

  @Input() modoSalvar: string;
  @Input() produto: Produto;
  @Input() produtoGrupoChecks: ProdutoGrupoChecks;

  cadastroGrupoCheckForm: FormGroup;
  cadastroCheckForm: FormGroup;
  cadastroCheckOpcoesForm: FormGroup;

  templateEnabled = false;

  checkList: ProdutoCheckList[] = [];
  checkListOpcoes: ProdutoCheckListOpcoes[] = [];
  produtoGrupoId: number;
  constructor(private produtoService: ProdutoService,
              private fb: FormBuilder,
              private toastr: ToastrService) {
                this.produtoService.atualizaProdutosGruposCheck.subscribe((produtoGrupos: ProdutoGrupoChecks[]) => {
                  this.produtoGrupoChecks = produtoGrupos.filter(c => c.id === this.produtoGrupoId)[0];
                  this.carregarGrupoCheck();
                });
              }

  ngOnInit() {
    this.validationGrupoCheck();
    this.validationCheck();
    this.validationCheckOpcoes();
    this.carregarGrupoCheck();
  }

  carregarGrupoCheck() {
    if (this.produtoGrupoChecks) {
      this.produtoGrupoId = this.produtoGrupoChecks.id;
      this.cadastroGrupoCheckForm.patchValue(this.produtoGrupoChecks);
      this.checkList = this.produtoGrupoChecks.checkList;
      this.checkListOpcoes = this.produtoGrupoChecks.checkListOpcoes;
    }
  }

  validationGrupoCheck() {
    this.cadastroGrupoCheckForm = this.fb.group({
        id: [''],
        descricao: ['', Validators.required],
        produtosId: ['']
    });
  }
  validationCheck() {
    this.cadastroCheckForm = this.fb.group({
        id: [''],
        descricao: ['', Validators.required]
    });
  }
  validationCheckOpcoes() {
    this.cadastroCheckOpcoesForm = this.fb.group({
        id: [''],
        descricao: ['', Validators.required]
    });
  }

  cadastrarGrupoCheck(template: any) {
    this.produtoGrupoChecks = Object.assign(this.cadastroGrupoCheckForm.value, {id: 0, produtosId: this.produto.id});
    this.produtoService.novoProdutoGrupoCheck(this.produtoGrupoChecks).subscribe(
      () => {
        this.produtoService.atualizarProdutos();
        this.toastr.success('Grupo Cadastrado com Sucesso!');
        this.fecharTemplate(template);
      }, error => {
        console.log(error.error);
      }
    );
  }

  salvarGrupoCheck() {
    this.produtoGrupoChecks = Object.assign(this.cadastroGrupoCheckForm.value, { checkList: null,
       checkListOpcoes: null, produtosId: this.produto.id});
    this.produtoService.editarProdutoGrupoCheck(this.produtoGrupoChecks).subscribe(
      () => {
        this.produtoService.atualizarProdutos();
        this.toastr.success('Grupo editado com Sucesso!');
      }, error => {
        console.log(error.error);
      }
    );
  }


  cadastrarCheck(template: any) {
    const check  = Object.assign(this.cadastroCheckForm.value, {id: 0, produtosGrupoChecksId: this.produtoGrupoChecks.id});
    this.produtoService.novoProdutoCheckList(check).subscribe(
      () => {
        this.produtoService.atualizarProdutos();
        this.toastr.success('Check Cadastrado com Sucesso!');
        this.fecharTemplateCheck(template);
      }, error => {
        console.log(error.error);
      }
    );
  }

  cadastrarCheckOpcoes(template: any) {
    const opcao  = Object.assign(this.cadastroCheckOpcoesForm.value, {id: 0, produtosGrupoChecksId: this.produtoGrupoChecks.id});
    this.produtoService.novoProdutoCheckListOpcoes(opcao).subscribe(
      () => {
        this.produtoService.atualizarProdutos();
        this.toastr.success('Opção Cadastrada com Sucesso!');
        this.fecharTemplateCheck(template);
      }, error => {
        console.log(error.error);
      }
    );
  }

  abrirTemplateCheck(template: any) {
    this.validationCheck();
    template.show();
  }

  abrirTemplateCheckOpcoes(template: any) {
    this.validationCheckOpcoes();
    template.show();
  }

  abrirTemplate(template: any) {
    if (this.templateEnabled === false) {
      this.templateEnabled = true;
      template.show();
    }
  }
  fecharTemplateCheck(template: any) {
    template.hide();
  }
  fecharTemplate(template: any) {
    template.hide();
    this.templateEnabled = false;
    this.produtoService.setCheckListProdutoStatus(false);
  }

}
