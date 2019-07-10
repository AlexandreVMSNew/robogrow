import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Produto } from 'src/app/_models/Cadastros/Produtos/produto';
import { ProdutoService } from 'src/app/_services/Cadastros/Produtos/produto.service';
import { ToastrService } from 'ngx-toastr';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-novo-produto',
  templateUrl: './novoProduto.component.html'
})
export class NovoProdutoComponent implements OnInit {

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

  validarForm() {
    this.cadastroForm = this.fb.group({
        id:  [''],
        descricao: ['']
    });
  }

  cadastrarProduto() {
    if (this.cadastroForm.valid) {
      this.produto = Object.assign(this.cadastroForm.value, {id: 0});
      this.produtoService.novoProduto(this.produto).subscribe(
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
