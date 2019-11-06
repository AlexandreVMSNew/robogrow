import { Component, OnInit, AfterViewInit } from '@angular/core';
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
import { PessoaService } from 'src/app/_services/Cadastros/Pessoas/pessoa.service';
import { EmpresaService } from 'src/app/_services/Cadastros/Empresas/empresa.service';
import { Empresa } from 'src/app/_models/Cadastros/Empresas/Empresa';
import { Pessoa } from 'src/app/_models/Cadastros/Pessoas/Pessoa';
import { PlanoPagamento } from 'src/app/_models/Cadastros/PlanoPagamento/PlanoPagamento';
import { PlanoPagamentoService } from 'src/app/_services/Cadastros/PlanoPagamento/planoPagamento.service';
import { TemplateModalService } from 'src/app/_services/Uteis/TemplateModal/templateModal.service';
import { CadastrarClienteComponent } from 'src/app/cadastros/cliente/cadastrarCliente/cadastrarCliente.component';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { PermissaoObjetos } from 'src/app/_models/Permissoes/permissaoObjetos';
import { BsDatepickerConfig } from 'ngx-bootstrap';
@Component({
  selector: 'app-cadastrar-venda',
  templateUrl: './cadastrarVenda.component.html'
})
export class CadastrarVendaComponent implements OnInit, AfterViewInit {

  formularioComponent = 'VENDAS';
  cadastrar = false;
  editar = false;
  listar = false;
  visualizar = false;
  excluir = false;

  cadastroForm: FormGroup;

  clientes: Cliente[];
  clienteIdSelecionado: any;

  empresas: Empresa[];
  empresaIdSelecionado: any;

  vendedores: Pessoa[];
  vendedorIdSelecionado: any;

  produtos: Produto[];
  produtoIdSelecionado: any;

  planosPagamento: PlanoPagamento[];
  planoPagamentoIdSelecionado: any;

  produtoVenda: VendaProduto[];
  venda: Venda;

  templateModalCadastrarClienteService = new TemplateModalService();
  cadastrarClienteComponent = CadastrarClienteComponent;

  componentModal: any;

  
  constructor(private fb: FormBuilder,
              private permissaoService: PermissaoService,
              private toastr: ToastrService,
              private router: Router,
              private clienteService: ClienteService,
              private produtoService: ProdutoService,
              private pessoaService: PessoaService,
              private empresaService: EmpresaService,
              private planoPagamentoService: PlanoPagamentoService,
              private vendaService: VendaService) {
  }

  ngOnInit() {
    this.getClientes();
    this.getProdutos();
    this.getEmpresas();
    this.getVendedores();
    this.getPlanoPagamento();
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
        dataNegociacao: ['', Validators.required],
        clientesId: ['', Validators.required],
        produtoId: ['', Validators.required],
        empresasId: ['', Validators.required],
        vendedorId: ['', Validators.required],
        planoPagamentoId: ['', Validators.required]
    });
  }

  cadastrarVenda() {
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    if (this.cadastroForm.valid) {
      const logsStatus = [{
        id: 0,
        usuarioId: this.permissaoService.getUsuarioId(),
        dataHora: dataAtual,
        status: 'EM NEGOCIAÇÃO'
      }];

      this.venda = Object.assign(this.cadastroForm.value, {
        id: 0,
        status: 'EM NEGOCIAÇÃO',
        dataEmissao: dataAtual,
        dataHoraUltAlt: dataAtual,
        vendaLogsStatus: logsStatus,
      });

      this.vendaService.cadastrarVenda(this.venda).subscribe(
        () => {
          this.vendaService.getIdUltimaVenda().subscribe(
            (_VENDA: Venda) => {
              const IdUltimaVenda = _VENDA.id;

              this.produtoVenda = [];
              this.produtoVenda.push(Object.assign({vendaId: IdUltimaVenda, produtosId: this.produtoIdSelecionado}));

              this.vendaService.cadastrarProdutoVenda(this.produtoVenda).subscribe(() => {
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

  abrirTemplateModal(component) {
    this.componentModal = component;
    this.templateModalCadastrarClienteService.setTemplateModalStatus(true);
  }

  getTemplateModal() {
    return this.templateModalCadastrarClienteService.getTemplateModalStatus();
  }

  getProdutos() {
    this.produtoService.getProduto().subscribe(
      (_PRODUTOS: Produto[]) => {
      this.produtos = _PRODUTOS;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar produtos: ${error.error}`);
    });
  }

  getClientes() {
    this.clienteService.getCliente().subscribe(
      (_CLIENTES: Cliente[]) => {
      this.clientes = _CLIENTES.filter(cliente => cliente.status !== 'INATIVO');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar clientes: ${error.error}`);
    });
  }

  getEmpresas() {
    this.empresaService.getEmpresa().subscribe(
      (_EMPRESAS: Empresa[]) => {
      this.empresas = _EMPRESAS.filter(cliente => cliente.status !== 'INATIVO');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar empresas: ${error.error}`);
    });
  }

  getVendedores() {
    this.pessoaService.getPessoa().subscribe(
      (_PESSOAS: Pessoa[]) => {
      this.vendedores = _PESSOAS.filter(pessoa =>
        pessoa.pessoaTipos.filter(c => c.tiposPessoa.descricao === 'VENDEDOR').length > 0
        && pessoa.status !== 'INATIVO');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar vendedores: ${error.error}`);
    });
  }

  getPlanoPagamento() {
    this.planoPagamentoService.getPlanoPagamento().subscribe(
      (_PLANOS: PlanoPagamento[]) => {
      this.planosPagamento = _PLANOS.filter(c => c.status !== 'INATIVO');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Planos de Pagamento: ${error.error}`);
    });
  }
}
