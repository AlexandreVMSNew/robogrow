import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Produto } from 'src/app/_models/Cadastros/Produtos/produto';
import { ProdutoService } from 'src/app/_services/Cadastros/Produtos/produto.service';
import { ToastrService } from 'ngx-toastr';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { Router } from '@angular/router';
import { PermissaoObjetos } from 'src/app/_models/Permissoes/permissaoObjetos';

@Component({
  selector: 'app-cadastrar-produto',
  templateUrl: './cadastrarProduto.component.html'
})
export class CadastrarProdutoComponent implements OnInit, AfterViewInit {

  formularioComponent = 'PRODUTOS';
  cadastrar = false;
  editar = false;
  listar = false;
  visualizar = false;
  excluir = false;

  cadastroForm: FormGroup;
  produto: Produto;

  constructor(public fb: FormBuilder,
              private toastr: ToastrService,
              private produtoService: ProdutoService,
              private router: Router,
              private changeDetectionRef: ChangeDetectorRef,
              public permissaoService: PermissaoService) { }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewChecked() {
    this.changeDetectionRef.detectChanges();
  }

  ngOnInit() {
    this.validarForm();
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

  validarForm() {
    this.cadastroForm = this.fb.group({
        id:  [''],
        descricao: ['', Validators.required],
        valorMinimo: ['', [Validators.required, Validators.min(1)]],
    });
  }

  cadastrarProduto() {
    if (this.cadastroForm.valid) {
      this.produto = Object.assign(this.cadastroForm.value, {id: 0});
      this.produtoService.cadastrarProduto(this.produto).subscribe(
        () => {
          this.produtoService.getIdUltimoProduto().subscribe(
            (_PRODUTO: Produto) => {
              const IdUltimoProduto = _PRODUTO.id;

              this.toastr.success('Cadastrado com sucesso!');
              this.router.navigate([`/produtos/editar/${IdUltimoProduto}`]);
          });
        }, error => {
          console.log(error.error);
        }
      );
    }
  }

}
