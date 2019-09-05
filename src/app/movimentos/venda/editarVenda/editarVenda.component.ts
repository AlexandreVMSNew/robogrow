import { Component, OnInit, ChangeDetectorRef, AfterViewChecked, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { VendaService } from 'src/app/_services/Movimentos/Venda/venda.service';
import { ActivatedRoute } from '@angular/router';
import { Venda } from 'src/app/_models/Movimentos/Venda/Venda';
import { ProdutoItem } from 'src/app/_models/Cadastros/Produtos/produtoItem';
import { VendaValorPrevisto } from 'src/app/_models/Movimentos/Venda/VendaValorPrevisto';
import { Pessoa } from 'src/app/_models/Cadastros/Pessoas/Pessoa';
import { PessoaService } from 'src/app/_services/Cadastros/Pessoas/pessoa.service';
import { DataService } from 'src/app/_services/Cadastros/Uteis/data.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { Permissao } from 'src/app/_models/Permissoes/permissao';
import { PlanoContas } from 'src/app/_models/Cadastros/PlanoContas/planoContas';
import { Cliente } from 'src/app/_models/Cadastros/Clientes/Cliente';
import { RecebimentoService } from 'src/app/_services/Financeiro/Recebimentos/recebimento.service';
import { CentroDespesa } from 'src/app/_models/Cadastros/CentroDespesa/CentroDespesa';
import { PlanoPagamento } from 'src/app/_models/Cadastros/PlanoPagamento/PlanoPagamento';
import * as jsPDF from 'jspdf';
import { Empresa } from 'src/app/_models/Cadastros/Empresas/Empresa';
import { Produto } from 'src/app/_models/Cadastros/Produtos/produto';
import { ClienteService } from 'src/app/_services/Cadastros/Clientes/cliente.service';
import { ProdutoService } from 'src/app/_services/Cadastros/Produtos/produto.service';
import { EmpresaService } from 'src/app/_services/Cadastros/Empresas/empresa.service';

@Component({
  selector: 'app-editar-venda',
  templateUrl: './editarVenda.component.html',
  styleUrls: ['./editarVenda.component.css']
})
export class EditarVendaComponent implements OnInit, AfterViewChecked, AfterViewInit {

  editar = false;
  editarValorPrevisto = false;
  editarValorRealizado = false;
  visualizarResumo = false;

  cadastroForm: FormGroup;
  cadastroValorPrevistoForm: FormGroup;
  cadastroRecebimento: FormGroup;
  cadastroNovoValor: FormGroup;

  pessoas: Pessoa[];
  pessoaIdSelecionado: any;

  clientes: Cliente[];
  clienteIdSelecionado: any;

  empresas: Empresa[];
  empresaIdSelecionado: any;

  vendedores: Pessoa[];
  vendedorIdSelecionado: any;

  produtos: Produto[];
  produtoIdSelecionado: any;

  centrosDespesa: CentroDespesa[];
  centroDespesaIdSelecionado: any;

  planoContasReceita: PlanoContas[];
  planoContasDespesa: PlanoContas[];
  planoContasIdSelecionado: any;

  idVenda: number;
  vendaClienteId: any;
  produtoItem: ProdutoItem;

  venda: Venda;

  vendaItensEntrada: ProdutoItem[];
  vendaItensSaidaComissao: ProdutoItem[];
  vendaItensSaidaGasto: ProdutoItem[];

  valorPrevistoPipe: any;
  valorPrevisto: VendaValorPrevisto;
  valorPrevistoDisabled = true;
  idProdutoItemValorPrevisto: number;

  status = ['EM NEGOCIAÇÃO', 'EM IMPLANTAÇÃO', 'FINALIZADO'];

  planosPagamento: PlanoPagamento[];
  planoPagamentoIdSelecionado: any;

  idDetalharRecebimento: number;
  idProdutoItem: number;

  bsConfig: Partial<BsDatepickerConfig> = Object.assign({}, { containerClass: 'theme-dark-blue' });
  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private router: ActivatedRoute,
              private vendaService: VendaService,
              private recebimentoService: RecebimentoService,
              public permissaoService: PermissaoService,
              public dataService: DataService,
              private clienteService: ClienteService,
              private produtoService: ProdutoService,
              private pessoaService: PessoaService,
              private empresaService: EmpresaService,
              private changeDetectionRef: ChangeDetectorRef) {
                this.vendaService.atualizaVenda.subscribe(x => {
                  this.carregarVenda();
                });
              }

  ngOnInit() {
    this.idVenda = +this.router.snapshot.paramMap.get('id');
    this.getClientes();
    this.getProdutos();
    this.getEmpresas();
    this.getVendedores();
    this.validarForm();
    this.validarValorPrevistoForm();
    this.validarNovoValorForm();
    this.carregarVenda();
  }

  ngAfterViewChecked() {
    this.changeDetectionRef.detectChanges();
  }

  ngAfterViewInit() {
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('VENDA', 'EDITAR').subscribe((_PERMISSAO: Permissao) => {
      this.editar = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('VENDA', 'EDITAR', 'VALOR PREVISTO').subscribe((_PERMISSAO: Permissao) => {
      this.editarValorPrevisto = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('VENDA', 'EDITAR', 'VALOR REALIZADO').subscribe((_PERMISSAO: Permissao) => {
      this.editarValorRealizado = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('VENDA', 'VISUALIZAR', 'RESUMO').subscribe((_PERMISSAO: Permissao) => {
      this.visualizarResumo = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
  }

  carregarVenda() {
    this.venda = null;
    this.vendaService.getVendaById(this.idVenda)
      .subscribe(
        (_VENDA: Venda) => {
          this.venda = Object.assign({}, _VENDA);

          this.venda = Object.assign(this.venda, {
            dataNegociacao: this.dataService.getDataPTBR(this.venda.dataNegociacao),
            dataFinalizado: this.dataService.getDataPTBR(this.venda.dataFinalizado)
          });

          this.produtoIdSelecionado = this.venda.vendaProdutos[0].produtosId;
          this.empresaIdSelecionado = this.venda.empresasId;
          this.vendedorIdSelecionado = this.venda.vendedorId;
          this.clienteIdSelecionado = this.venda.clientesId;

          this.cadastroForm.patchValue(this.venda);
          this.vendaItensEntrada = this.venda.vendaProdutos[0].produtos.itens.filter(item => item.tipoItem === 'RECEITA');
          this.vendaItensEntrada.forEach(item => {
            item.vendaValorPrevisto = this.venda.vendaValorPrevisto.filter(c => c.produtosItensId === item.id)[0];
            item.vendaValorRealizado = this.venda.vendaValorRealizado.filter(c => c.produtosItensId === item.id);
          });

          this.vendaItensSaidaComissao = this.venda.vendaProdutos[0].produtos.itens.filter(
            item => item.tipoItem === 'DESPESA' && item.subTipoItem === 'COMISSÃO');
          this.vendaItensSaidaComissao.forEach(item => {
            item.vendaValorPrevisto = this.venda.vendaValorPrevisto.filter(c => c.produtosItensId === item.id)[0];
            item.vendaValorRealizado = this.venda.vendaValorRealizado.filter(c => c.produtosItensId === item.id);
          });

          this.vendaItensSaidaGasto = this.venda.vendaProdutos[0].produtos.itens.filter(
            item => item.tipoItem === 'DESPESA' && item.subTipoItem === 'GASTO');
          this.vendaItensSaidaGasto.forEach(item => {
            item.vendaValorPrevisto = this.venda.vendaValorPrevisto.filter(c => c.produtosItensId === item.id)[0];
            item.vendaValorRealizado = this.venda.vendaValorRealizado.filter(c => c.produtosItensId === item.id);
          });

          this.vendaClienteId = this.venda.clientesId;

        }, error => {
          this.toastr.error(`Erro ao tentar carregar Venda: ${error.error}`);
          console.log(error);
        });
  }

  gerarPDF() {
    const documento: jsPDF = new jsPDF();
    documento.line(10, 10, 200, 10);
    documento.setFontSize(10);
    documento.text(this.empresas.filter(c => c.id === this.empresaIdSelecionado)[0].nomeFantasia, 10, 15);
    documento.text(this.empresas.filter(c => c.id === this.empresaIdSelecionado)[0].razaoSocial, 10, 20);
    documento.text('CNPJ/CPF: ' + this.empresas.filter(c => c.id === this.empresaIdSelecionado)[0].cnpjCpf, 10, 25);
    documento.output('dataurlnewwindow');
  }

  disabledStatus() {
    if (this.venda) {
      if (this.venda.status === 'FINALIZADO') {
        this.cadastroForm.get('status').disable();
        return true;
      } else {
        this.cadastroForm.get('status').enable();
        return true;
      }
    }
    return true;
  }

  disabledDataNegociacao() {
    if (this.venda) {
      if (this.venda.dataNegociacao.toString() !== '') {
        return true;
      }
    }
    return false;
  }

  showedDataFinalizado() {
    if (this.venda) {
      if (this.venda.status === 'FINALIZADO') {
        return true;
      }
    }
    return false;
  }

  setarDataFinalizado(status: string) {
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    if (status === 'FINALIZADO') {
      this.cadastroForm.controls.dataFinalizado.setValue(dataAtual);
    } else {
      this.cadastroForm.controls.dataFinalizado.setValue('');
    }
  }

  getNomeCliente() {
    if (this.venda) {
      if (this.venda.clientes) {
        return this.venda.clientes.nomeFantasia;
      }
    }
    return '';
  }

  validarForm() {
    this.cadastroForm = this.fb.group({
        id:  [''],
        clientesId: ['', Validators.required],
        vendedorId: ['', Validators.required],
        empresasId: ['', Validators.required],
        produtoId: ['', Validators.required],
        status: ['', Validators.required],
        dataEmissao: [''],
        dataNegociacao: [''],
        dataFinalizado: [''],
        dataHoraUltAlt: ['']
    });
  }

  abrirTemplateRecebimento(produtoItem: ProdutoItem) {
    this.produtoItem = produtoItem;
    if (produtoItem.vendaValorRealizado && produtoItem.vendaValorRealizado.length > 0) {
      if (produtoItem.vendaValorRealizado[0].recebimentos) {
        this.idDetalharRecebimento = produtoItem.vendaValorRealizado[0].recebimentos.id;
        this.recebimentoService.setDetalharRecebimentoStatus(true);
      } else {
        this.recebimentoService.setTemplateRecebimentoStatus(true);
      }
    } else {
      this.recebimentoService.setTemplateRecebimentoStatus(true);
    }
  }

  getPagamentosVenda() {
    return this.vendaService.getPagamentosVendaStatus();
  }

  getRecebimentosVenda() {
    return this.vendaService.getRecebimentosVendaStatus();
  }

  abrirPagamentosVenda(produtoItem: ProdutoItem) {
    this.produtoItem = produtoItem;
    this.vendaService.setPagamentosVendaStatus(true);
  }

  abrirRecebimentosVenda(produtoItem: ProdutoItem) {
    this.produtoItem = produtoItem;
    this.vendaService.setRecebimentosVendaStatus(true);
  }


  validarValorPrevistoForm() {
    this.cadastroValorPrevistoForm = this.fb.group({
        id: [''],
        valor: ['', Validators.required]
    });
  }

  verificarPrevisto(vendaValorPrevisto: any): boolean {
    if (vendaValorPrevisto) {
      return true;
    }
    return false;
  }

  verificarValorPrevistoMaiorZero(vendaValorPrevisto: any): boolean {
    if (vendaValorPrevisto) {
      if (vendaValorPrevisto.valor > 0) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  verificarPagamento(ValorRealizado: any): boolean {
    if (ValorRealizado) {
      if (ValorRealizado.length > 0) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  verificarStatus() {
    if (this.cadastroForm.get('status')) {
      return this.cadastroForm.get('status').value;
    }
  }

  abrirFormValorPrevisto(idProdutoItem: number, descricaoItem: string, template: any) {
    this.idProdutoItemValorPrevisto = idProdutoItem;
    this.vendaService.getVendaValorPrevistoByProdIdVendId(idProdutoItem, this.idVenda).subscribe(
      (_VALORPREVISTO: VendaValorPrevisto) => {
        if (_VALORPREVISTO) {
          this.valorPrevistoDisabled = true;
          this.valorPrevisto = Object.assign({}, _VALORPREVISTO);
          this.cadastroValorPrevistoForm.patchValue(this.valorPrevisto);
        } else {
          this.valorPrevisto = null;
          this.valorPrevistoDisabled = false;
          this.cadastroValorPrevistoForm.patchValue({id: 0, valor: null});
        }

      }, error => {
        console.log(error.error);
      }
    );
    template.show();
  }

  salvarValorPrevisto(template: any) {
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    this.valorPrevisto = Object.assign(this.cadastroValorPrevistoForm.value,
       {id: 0, vendaId: this.idVenda, produtosItensId: this.idProdutoItemValorPrevisto, dataHoraUltAlt: dataAtual});
    this.vendaService.novoVendaValorPrevisto(this.valorPrevisto).subscribe(
      () => {
        this.carregarVenda();
        this.toastr.success('Salvo com Sucesso!');
        template.hide();
      }, error => {
        console.log(error.error);
      }
    );
  }

  validarNovoValorForm() {
    this.cadastroNovoValor = this.fb.group({
        valor: ['', Validators.required],
        pessoasId:  ['', Validators.required],
        dataPagamento: [''],
        descricao:  ['', Validators.required]
    });
  }

  salvarAlteracoes() {
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    const dataNeg = this.cadastroForm.get('dataNegociacao').value.toLocaleString();
    const dataFin = this.cadastroForm.get('dataFinalizado').value.toLocaleString();

    this.venda = Object.assign(this.cadastroForm.value, {id: this.venda.id,
      dataNegociacao: this.dataService.getDataSQL(dataNeg),
      dataFinalizado: this.dataService.getDataSQL(dataFin),
      dataHoraUltAlt: dataAtual
    });

    this.vendaService.editarVenda(this.venda).subscribe(
      () => {
        this.toastr.success('Editado com sucesso!');
        this.carregarVenda();
      }, error => {
        this.toastr.error(`Erro ao tentar Editar: ${error.error}`);
        console.log(error);
      });
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

  getEmpresas() {
    this.empresaService.getAllEmpresa().subscribe(
      (_EMPRESAS: Empresa[]) => {
      this.empresas = _EMPRESAS.filter(cliente => cliente.status !== 'INATIVO');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar empresas: ${error.error}`);
    });
  }

  getVendedores() {
    this.pessoaService.getAllPessoa().subscribe(
      (_PESSOAS: Pessoa[]) => {
      this.vendedores = _PESSOAS.filter(pessoa =>
        pessoa.pessoaTipos.filter(c => c.tiposPessoa.descricao === 'VENDEDOR').length > 0
        && pessoa.status !== 'INATIVO');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar vendedores: ${error.error}`);
    });
  }

}
