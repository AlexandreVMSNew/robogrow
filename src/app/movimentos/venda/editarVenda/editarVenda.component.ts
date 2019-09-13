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
import { Empresa } from 'src/app/_models/Cadastros/Empresas/Empresa';
import { Produto } from 'src/app/_models/Cadastros/Produtos/produto';
import { ClienteService } from 'src/app/_services/Cadastros/Clientes/cliente.service';
import { ProdutoService } from 'src/app/_services/Cadastros/Produtos/produto.service';
import { EmpresaService } from 'src/app/_services/Cadastros/Empresas/empresa.service';
import { AutorizacaoService } from 'src/app/_services/Autorizacoes/autorizacao.service';
import { Usuario } from 'src/app/_models/Cadastros/Usuarios/Usuario';
import { UsuarioService } from 'src/app/_services/Cadastros/Usuarios/usuario.service';
import { SocketService } from 'src/app/_services/WebSocket/Socket.service';
import { NotificacaoService } from 'src/app/_services/Notificacoes/notificacao.service';
import { Notificacao } from 'src/app/_models/Notificacoes/notificacao';
import { Autorizacao } from 'src/app/_models/Autorizacoes/Autorizacao';
import { EmailService } from 'src/app/_services/Email/email.service';
import { Email } from 'src/app/_models/Email/Email';
import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-editar-venda',
  templateUrl: './editarVenda.component.html',
  styleUrls: ['./editarVenda.component.css']
})
export class EditarVendaComponent implements OnInit, AfterViewChecked, AfterViewInit {

  editar = false;
  editarValorPrevisto = false;
  editarValorRealizado = false;
  editarDataNegociacao = false;
  editarStatus = false;
  visualizarResumo = false;
  visualizar = false;
  gerarPedido = false;
  autorizadoGerarPedido = false;

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
  itemDescricao: string;

  status = ['EM NEGOCIAÇÃO', 'EM IMPLANTAÇÃO', 'IMPLANTADO', 'FINALIZADO', 'DISTRATADO'];
  statusSelecionado: string;

  planosPagamento: PlanoPagamento[];
  planoPagamentoIdSelecionado: any;

  idDetalharRecebimento: number;
  idProdutoItem: number;

  autorizacoes: Autorizacao[];

  statusBoxInformacoes = '';
  statusBoxImplantacao = '';
  statusBoxConversao = '';

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
              private usuarioService: UsuarioService,
              private empresaService: EmpresaService,
              private autorizacaoService: AutorizacaoService,
              private socketService: SocketService,
              private emailService: EmailService,
              private notificacaoService: NotificacaoService,
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
    this.getAutorizacoes();
    this.validarForm();
    this.validarValorPrevistoForm();
    this.validarNovoValorForm();
  }

  ngAfterViewChecked() {
    this.changeDetectionRef.detectChanges();
  }

  ngAfterViewInit() {
    this.permissaoService.getPermissoesByFormulario(
      Object.assign({formulario: 'VENDA'})).subscribe((_PERMISSOES: Permissao[]) => {
      this.editar = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'EDITAR')[0]);
      this.editarValorPrevisto = this.permissaoService
          .verificarPermissao(_PERMISSOES.filter(c => c.acao === 'EDITAR' && c.objeto === 'VALOR PREVISTO')[0]);
      this.editarValorRealizado = this.permissaoService
          .verificarPermissao(_PERMISSOES.filter(c => c.acao === 'EDITAR' && c.objeto === 'VALOR REALIZADO')[0]);
      this.editarDataNegociacao = this.permissaoService
          .verificarPermissao(_PERMISSOES.filter(c => c.acao === 'EDITAR' && c.objeto === 'DATA NEGOCIAÇÃO')[0]);
      this.editarStatus = this.permissaoService
          .verificarPermissao(_PERMISSOES.filter(c => c.acao === 'EDITAR' && c.objeto === 'STATUS')[0]);
      this.visualizar = this.permissaoService
          .verificarPermissao(_PERMISSOES.filter(c => c.acao === 'VISUALIZAR')[0]);
      this.visualizarResumo = this.permissaoService
          .verificarPermissao(_PERMISSOES.filter(c => c.acao === 'VISUALIZAR' && c.objeto === 'RESUMO')[0]);
      this.gerarPedido = this.permissaoService
          .verificarPermissao(_PERMISSOES.filter(c => c.acao === 'GERAR PEDIDO')[0]);
      const form = this.cadastroForm.controls;
      if (this.editar) {
        form.empresasId.enable(); form.vendedorId.enable(); form.clientesId.enable(); form.produtoId.enable();
      } else {
        form.empresasId.disable(); form.vendedorId.disable(); form.clientesId.disable(); form.produtoId.disable();
      }
      (this.editarDataNegociacao) ? form.dataNegociacao.enable() : form.dataNegociacao.disable();
      (this.editarStatus) ? form.status.enable() : form.status.disable();
      this.carregarVenda();
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
          this.statusSelecionado = this.venda.status;

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

  enviarNotificacoesAutorizacao() {
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    const usuariosIdNotificacao = [];
    const usuariosEmailNotificacao: any = [];
    this.usuarioService.getAllUsuario().subscribe(
      (_USUARIOS: Usuario[]) => {
      this.permissaoService.getPermissoesByFormularioAcaoObjeto(
        Object.assign({formulario: 'AUTORIZACOES', acao: 'GERAR PEDIDO'})).subscribe((_PERMISSAO: Permissao) => {
        _PERMISSAO.permissaoNiveis.forEach((permissao) => {
          _USUARIOS.forEach((usuario: Usuario) => {
            if (usuario.usuarioNivel.filter(c => c.roleId === permissao.nivelId).length > 0) {
              usuariosIdNotificacao.push(usuario.id);
              usuariosEmailNotificacao.push(usuario.email);
            }
          });
        });
        const email: Email = {
          emailRemetente: 'virtualwebsistema@gmail.com',
          nomeRemetente: 'Virtual Web',
          senhaRemetente: '1379258vms//',
          emailDestinatario: usuariosEmailNotificacao,
          assunto: 'Autorização PEDIDO DE VENDA',
          mensagem: 'Você tem uma autorização de Pedido de Venda pendente. <br/>' +
          'Para analisar a Venda: ' +
          '<a href="https://virtualweb.herokuapp.com/movimentos/vendas/editar/' + this.idVenda + '">CLIQUE AQUI!</a>',
        };
        this.emailService.enviarEmail(email).subscribe((_RESPOSTA) => {
        }, error => {
          console.log(error.error);
        });
        const notificacao: Notificacao[] = [];
        usuariosIdNotificacao.forEach(idUsuario => {
          notificacao.push(Object.assign({id: 0, usuarioId: idUsuario, dataHora: dataAtual, tipo: 'Autorização', visto: 0}));
        });
        this.notificacaoService.novasNotificacoes(notificacao).subscribe(
          () => {
          usuariosIdNotificacao.forEach(idUsuario => {
            this.socketService.sendSocket('AutorizacaoVendaGerarPedido', idUsuario);
          });
          this.toastr.success('Cadastrado com sucesso!');
        });
      });
    });
  }


  solicitarAutorizacao() {
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    const autorizacao = Object.assign({
      id: 0,
      solicitanteId: this.permissaoService.getUsuarioId(),
      formularioId: this.idVenda,
      formulario: 'VENDA',
      acao: 'GERAR PEDIDO',
      dataHoraSolicitado: dataAtual,
      autorizado: 0,
      visto: 0
    });
    this.autorizacaoService.novaAutorizacao(autorizacao).subscribe(() => {
      this.enviarNotificacoesAutorizacao();
    }, error => {
      this.toastr.error(`Erro ao tentar solicitar autorizacao: ${error.error}`);
      console.log(error);
    });
  }

  gerarPDF() {
    const documento: jsPDF = new jsPDF();
    const empresa: Empresa = this.empresas.filter(c => c.id === this.empresaIdSelecionado)[0];
    const cliente: Cliente = this.venda.clientes;
    documento.line(10, 10, 200, 10);
    documento.setFontSize(10);
    documento.setFontType('bold');
    documento.text('Nome Fantasia: ' , 10, 15);
    documento.setFontType('regular');
    documento.text(empresa.nomeFantasia, 40, 15);
    documento.setFontType('bold');
    documento.text('Razão Social: ' , 10, 20);
    documento.setFontType('regular');
    documento.text(empresa.razaoSocial, 34, 20);
    documento.setFontType('bold');
    documento.text('CNPJ/CPF: ' , 10, 25);
    documento.setFontType('regular');
    documento.text(empresa.cnpjCpf, 30, 25);

    documento.line(10, 30, 200, 30);
    documento.setFontType('bold');
    documento.text('Nome Fantasia: ' , 10, 35);
    documento.setFontType('regular');
    documento.text(cliente.nomeFantasia, 40, 35);
    documento.setFontType('bold');
    documento.text('Razão Social: ' , 10, 40);
    documento.setFontType('regular');
    documento.text(cliente.razaoSocial, 34, 40);
    documento.rect(50, 50, 100, 100);
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
    const dataAtual = moment(new Date(), 'DD/MM/YYYY').format('YYYY-MM-DD');
    if (status === 'FINALIZADO') {
      this.cadastroForm.controls.dataFinalizado.setValue(this.dataService.getDataPTBR(dataAtual));
    } else {
      this.cadastroForm.controls.dataFinalizado.setValue('');
    }
  }

  getCliente(): Cliente {
    if (this.venda) {
      if (this.venda.clientes) {
        return this.venda.clientes;
      }
    }
    return null;
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

  alterarStatusBoxInformacoes() {
    (this.statusBoxInformacoes === '') ? this.statusBoxInformacoes = ' collapsed-box' : this.statusBoxInformacoes = '';
  }
  alterarStatusBoxImplantacao() {
    (this.statusBoxImplantacao === '') ? this.statusBoxImplantacao = ' collapsed-box' : this.statusBoxImplantacao = '';
  }
  alterarStatusBoxConversao() {
    (this.statusBoxConversao === '') ? this.statusBoxConversao = ' collapsed-box' : this.statusBoxConversao = '';
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

  verificarValorPrevistoLancados() {
    if (this.venda) {
      if (this.venda.vendaValorPrevisto &&  this.venda.vendaProdutos[0].produtos.itens) {
        if (this.venda.vendaValorPrevisto.length === this.venda.vendaProdutos[0].produtos.itens.length) {
          return false;
        }
      }
    }
    return true;
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
    this.itemDescricao = descricaoItem;
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
      dataHoraUltAlt: dataAtual,
      empresasId: this.empresaIdSelecionado,
      clienteId: this.clienteIdSelecionado,
      produtoId: this.produtoIdSelecionado,
      vendendorId: this.vendedorIdSelecionado,
      status: this.statusSelecionado,
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

  getAutorizacoes() {
    this.autorizacaoService.getAutorizacaoFormularioById(this.idVenda).subscribe(
      (_AUTORIZACOES: Autorizacao[]) => {
      this.autorizacoes = _AUTORIZACOES;
      if (this.autorizacoes.filter(c => c.autorizado === 1).length > 0) {
        this.autorizadoGerarPedido = true;
      }
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar autorizacoes: ${error.error}`);
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
