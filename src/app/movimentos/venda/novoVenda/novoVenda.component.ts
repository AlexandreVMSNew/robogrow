import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Cliente } from 'src/app/_models/Cadastros/Clientes/Cliente';
import { ToastrService } from 'ngx-toastr';
import { ClienteService } from 'src/app/_services/Cadastros/Clientes/cliente.service';
import { Produto } from 'src/app/_models/Cadastros/Produtos/produto';
import { ProdutoService } from 'src/app/_services/Cadastros/Produtos/produto.service';
import { Venda } from 'src/app/_models/Movimentos/Venda/Venda';
import { VendaService } from 'src/app/_services/Movimentos/Venda/venda.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { VendaProduto } from 'src/app/_models/Movimentos/Venda/VendaProduto';
@Component({
  selector: 'app-novo-venda',
  templateUrl: './novoVenda.component.html'
})
export class NovoVendaComponent implements OnInit {

  cadastroForm: FormGroup;

  clientes: Cliente[];
  clienteIdSelecionado: any;

  produtos: Produto[];
  produtoIdSelecionado: any;

  produtoVenda: VendaProduto[];
  venda: Venda;
  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private router: Router,
              private clienteService: ClienteService,
              private produtoService: ProdutoService,
              private vendaService: VendaService) { }

  ngOnInit() {
    this.getClientes();
    this.getProdutos();
    this.validarForm();
  }

  validarForm() {
    this.cadastroForm = this.fb.group({
        id:  [''],
        clientesId: ['', Validators.required],
        produtoId: ['', Validators.required]
    });
  }

  cadastrarVenda() {
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    if (this.cadastroForm.valid) {
      this.venda = Object.assign(this.cadastroForm.value, {id: 0, status: 'EM ABERTO', dataEmissao: dataAtual, dataHoraUltAlt: dataAtual});

      this.vendaService.novoVenda(this.venda).subscribe(
        () => {
          this.vendaService.getIdUltimaVenda().subscribe(
            (_VENDA: Venda) => {
              const IdUltimaVenda = _VENDA.id;

              this.produtoVenda = [];
              this.produtoVenda.push(Object.assign({vendaId: IdUltimaVenda, produtosId: this.produtoIdSelecionado}));

              this.vendaService.novoProdutoVenda(this.produtoVenda).subscribe(() => {
                this.toastr.success('Cadastrado com sucesso!');
                this.router.navigate([`/movimentos/vendas/editar/${IdUltimaVenda}`]);
              });
          });
        }, error => {
          console.log(error.error);
        }
      );
    }
  }

  getProdutos() {
    this.produtoService.getAllProduto().subscribe(
      (_PRODUTOS: Produto[]) => {
      this.produtos = _PRODUTOS;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar produtos: ${error.error}`);
    });
  }

  getClientes() {
    this.clienteService.getAllCliente().subscribe(
      (_CLIENTES: Cliente[]) => {
      this.clientes = _CLIENTES.filter(cliente => cliente.status !== 'INATIVO');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar clientes: ${error.error}`);
    });
  }

}