import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProdutoService } from 'src/app/_services/Cadastros/Produtos/produto.service';
import { ActivatedRoute } from '@angular/router';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { Produto } from 'src/app/_models/Cadastros/Produtos/produto';
import { PermissaoObjetos } from 'src/app/_models/Permissoes/permissaoObjetos';

@Component({
  selector: 'app-editar-produto',
  templateUrl: './editarProduto.component.html'
})
export class EditarProdutoComponent implements OnInit, AfterViewInit {

  formularioComponent = 'PRODUTOS';
  cadastrar = false;
  editar = false;
  listar = false;
  visualizar = false;
  excluir = false;

  cadastroForm: FormGroup;

  produto: Produto;
  idProduto: number;

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

  ngAfterViewInit() {
    this.permissaoService.getPermissaoObjetosByFormularioAndNivelId(Object.assign({ formulario: this.formularioComponent }))
    .subscribe((permissaoObjetos: PermissaoObjetos[]) => {
      const permissaoFormulario = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'FORMULÁRIO');
      this.cadastrar = (permissaoFormulario !== null ) ? permissaoFormulario.cadastrar : false;
      this.editar = (permissaoFormulario !== null ) ? permissaoFormulario.editar : false;
      this.listar = (permissaoFormulario !== null ) ? permissaoFormulario.listar : false;
      this.visualizar = (permissaoFormulario !== null ) ? permissaoFormulario.visualizar : false;
      this.excluir = (permissaoFormulario !== null ) ? permissaoFormulario.excluir : false;
    }, error => {
      console.log(error.error);
    });
  }

  carregarProduto() {
    this.produtoService.getProdutoById(this.idProduto)
    .subscribe((produto: Produto) => {
      this.produto = Object.assign({}, produto);
      this.cadastroForm.patchValue(this.produto);

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
