import { Component, OnInit, ChangeDetectorRef, AfterViewChecked, AfterViewInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { VendaService } from 'src/app/_services/Movimentos/Venda/venda.service';
import { ActivatedRoute } from '@angular/router';
import { Venda } from 'src/app/_models/Movimentos/Venda/Venda';
import { Pessoa } from 'src/app/_models/Cadastros/Pessoas/Pessoa';
import { PessoaService } from 'src/app/_services/Cadastros/Pessoas/pessoa.service';
import { DataService } from 'src/app/_services/Cadastros/Uteis/data.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { Permissao } from 'src/app/_models/Permissoes/permissao';
import { PlanoContas } from 'src/app/_models/Cadastros/PlanoContas/planoContas';
import { Cliente } from 'src/app/_models/Cadastros/Clientes/Cliente';
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
import { ProdutoGrupoChecks } from 'src/app/_models/Cadastros/Produtos/produtoGrupoChecks';
import { ProdutoCheckListOpcoes } from 'src/app/_models/Cadastros/Produtos/ProdutoCheckListOpcoes';
import { ProdutoCheckList } from 'src/app/_models/Cadastros/Produtos/produtoCheckList';
import { PlanoPagamentoService } from 'src/app/_services/Cadastros/PlanoPagamento/planoPagamento.service';
import { EditarClienteComponent } from 'src/app/cadastros/cliente/editarCliente/editarCliente.component';
import { TemplateModalService } from 'src/app/_services/Uteis/TemplateModal/templateModal.service';
import { VendaPublicacao } from 'src/app/_models/Movimentos/Venda/VendaPublicacao';
import { Publicacao } from 'src/app/_models/Publicacoes/Publicacao';
import { SpinnerService } from 'src/app/_services/Uteis/Spinner/spinner.service';
import { HttpClient } from '@angular/common/http';
import { PermissaoObjetos } from 'src/app/_models/Permissoes/permissaoObjetos';

@Component({
  selector: 'app-editar-venda',
  templateUrl: './editarVenda.component.html',
  styleUrls: ['./editarVenda.component.css']
})
export class EditarVendaComponent implements OnInit, AfterViewChecked, AfterViewInit {

  @Input() idVenda: number = null;

  formularioComponent = 'VENDAS';
  cadastrar = false;
  editar = false;
  listar = false;
  visualizar = false;
  excluir = false;

  cadastrarValorPrevisto = false;
  cadastrarValorRealizado = false;
  editarCampoDataNegociacao = false;
  editarCampoStatus = false;
  editarCampoEmpresa = false;
  editarCampoVendedor = false;
  editarCampoCliente = false;
  editarCampoProduto = false;
  editarCampoPlanoPagamento = false;
  editarCampoObservacoes = false;
  editarCampoDataFinalizado = false;
  visualizarAbaResultado = false;
  visualizarAbaFinanceiro = false;
  gerarPedido = false;
  autorizadoGerarPedido = false;

  cadastroForm: FormGroup;

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

  venda: Venda;

  status = [''];
  statusInicialSelecionado: string;
  statusSelecionado: string;

  planosPagamento: PlanoPagamento[];
  planoPagamentoIdSelecionado: any;

  autorizacoes: Autorizacao[];

  statusBoxInformacoes = '';

  gruposCheckList: ProdutoGrupoChecks[] = [];
  checks: ProdutoCheckList[] = [];
  checksOpcoes: ProdutoCheckListOpcoes[] = [];

  templateModalClienteService = new TemplateModalService();
  editarClienteComponent = EditarClienteComponent;
  inputs: any;
  componentModal: any;

  publicacoes: Publicacao[];

  bsConfig: Partial<BsDatepickerConfig> = Object.assign({}, { containerClass: 'theme-dark-blue' });
  constructor(private fb: FormBuilder,
              private spinnerService: SpinnerService,
              private toastr: ToastrService,
              private router: ActivatedRoute,
              private vendaService: VendaService,
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
              private planoPagamentoService: PlanoPagamentoService,
              private notificacaoService: NotificacaoService,
              private changeDetectionRef: ChangeDetectorRef) {
                this.vendaService.atualizaVenda.subscribe(x => {
                  this.carregarVenda();
                });
                this.vendaService.atualizaPublicacoesVenda.subscribe(x => {
                  this.carregarVendaPublicacoes();
                });
              }

  ngOnInit() {
    if (this.idVenda === null) { this.idVenda = +this.router.snapshot.paramMap.get('id'); }
    this.getClientes();
    this.getProdutos();
    this.getEmpresas();
    this.getVendedores();
    this.getPlanoPagamento();
    this.validarForm();
  }

  ngAfterViewChecked() {
    this.changeDetectionRef.detectChanges();
  }

  ngAfterViewInit() {
    this.spinnerService.alterarSpinnerStatus(true);
    this.permissaoService.getPermissaoObjetosByFormularioAndNivelId(Object.assign({ formulario: this.formularioComponent }))
    .subscribe((permissaoObjetos: PermissaoObjetos[]) => {
      const permissaoFormulario = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'FORMULÁRIO');
      this.cadastrar = (permissaoFormulario !== null ) ? permissaoFormulario.cadastrar : false;
      this.editar = (permissaoFormulario !== null ) ? permissaoFormulario.editar : false;
      this.listar = (permissaoFormulario !== null ) ? permissaoFormulario.listar : false;
      this.visualizar = (permissaoFormulario !== null ) ? permissaoFormulario.visualizar : false;
      this.excluir = (permissaoFormulario !== null ) ? permissaoFormulario.excluir : false;

      const permissaoValorPrevisto = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'VALOR PREVISTO');
      this.cadastrarValorPrevisto = (permissaoValorPrevisto !== null ) ? permissaoValorPrevisto.cadastrar : false;

      const permissaoValorRealizado = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'VALOR REALIZADO');
      this.cadastrarValorRealizado = (permissaoValorRealizado !== null ) ? permissaoValorRealizado.cadastrar : false;

      const permissaoCampoStatus = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'CAMPO STATUS');
      this.editarCampoStatus = (permissaoCampoStatus !== null ) ? permissaoCampoStatus.editar : false;

      const permissaoCampoDataNegociacao = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'CAMPO DATA NEGOCIAÇÃO');
      this.editarCampoDataNegociacao = (permissaoCampoDataNegociacao !== null ) ? permissaoCampoDataNegociacao.editar : false;

      const permissaoCampoEmpresa = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'CAMPO EMPRESA');
      this.editarCampoEmpresa = (permissaoCampoEmpresa !== null ) ? permissaoCampoEmpresa.editar : false;

      const permissaoCampoVendedor = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'CAMPO VENDEDOR');
      this.editarCampoVendedor = (permissaoCampoVendedor !== null ) ? permissaoCampoVendedor.editar : false;

      const permissaoCampoCliente = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'CAMPO CLIENTE');
      this.editarCampoCliente = (permissaoCampoCliente !== null ) ? permissaoCampoCliente.editar : false;

      const permissaoCampoProduto = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'CAMPO PRODUTO');
      this.editarCampoProduto = (permissaoCampoProduto !== null ) ? permissaoCampoProduto.editar : false;

      const permissaoCampoPlanoPagamento = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'CAMPO PLANO DE PAGAMENTO');
      this.editarCampoPlanoPagamento = (permissaoCampoPlanoPagamento !== null ) ? permissaoCampoPlanoPagamento.editar : false;

      const permissaoCampoObservacoes = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'CAMPO OBSERVAÇÕES');
      this.editarCampoObservacoes = (permissaoCampoObservacoes !== null ) ? permissaoCampoObservacoes.editar : false;

      const permissaoCampoDataFinalizado = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'CAMPO DATA FINALIZADO');
      this.editarCampoDataFinalizado = (permissaoCampoDataFinalizado !== null ) ? permissaoCampoDataFinalizado.editar : false;

      const permissaoAbaResultado = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'ABA RESULTADO');
      this.visualizarAbaResultado = (permissaoAbaResultado !== null ) ? permissaoAbaResultado.visualizar : false;

      const permissaoAbaFinanceiro = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'ABA FINANCEIRO');
      this.visualizarAbaFinanceiro = (permissaoAbaFinanceiro !== null ) ? permissaoAbaFinanceiro.visualizar : false;

      const permissaoPedido = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'GERAR PEDIDO');
      this.gerarPedido = (permissaoPedido !== null ) ? permissaoPedido.visualizar : false;

      this.spinnerService.alterarSpinnerStatus(false);
      this.carregarVenda();
    }, error => {
      this.spinnerService.alterarSpinnerStatus(false);
      console.log(error.error);
    });
  }

  configurarAlteracoes() {

    if (this.editar === true && this.statusSelecionado === 'EM NEGOCIAÇÃO') {
      this.cadastroForm.controls.empresasId.enable(); this.cadastroForm.controls.vendedorId.enable();
      this.cadastroForm.controls.clientesId.enable(); this.cadastroForm.controls.produtoId.enable();
      this.cadastroForm.controls.planoPagamentoId.enable();
    } else {
      this.cadastroForm.controls.empresasId.disable(); this.cadastroForm.controls.vendedorId.disable();
      this.cadastroForm.controls.clientesId.disable(); this.cadastroForm.controls.produtoId.disable();
      this.cadastroForm.controls.planoPagamentoId.disable();
    }

    (this.editarCampoStatus === true || this.autorizadoGerarPedido === true) ?
    this.cadastroForm.controls.status.enable() : this.cadastroForm.controls.status.disable();

    (this.editarCampoDataNegociacao === true && this.statusSelecionado === 'EM NEGOCIAÇÃO') ?
    this.cadastroForm.controls.dataNegociacao.enable() : this.cadastroForm.controls.dataNegociacao.disable();

    (this.editarCampoEmpresa === true) ?
    this.cadastroForm.controls.empresasId.enable() : this.cadastroForm.controls.empresasId.disable();

    (this.editarCampoVendedor === true) ?
    this.cadastroForm.controls.vendedorId.enable() : this.cadastroForm.controls.vendedorId.disable();

    (this.editarCampoCliente === true) ?
    this.cadastroForm.controls.clientesId.enable() : this.cadastroForm.controls.clientesId.disable();

    (this.editarCampoProduto === true) ?
    this.cadastroForm.controls.produtoId.enable() : this.cadastroForm.controls.produtoId.disable();

    (this.editarCampoPlanoPagamento === true) ?
    this.cadastroForm.controls.planoPagamentoId.enable() : this.cadastroForm.controls.planoPagamentoId.disable();

    (this.editarCampoObservacoes === true) ?
    this.cadastroForm.controls.observacoes.enable() : this.cadastroForm.controls.observacoes.disable();

    (this.editarCampoDataFinalizado === true) ?
    this.cadastroForm.controls.dataFinalizado.enable() : this.cadastroForm.controls.dataFinalizado.disable();

    this.spinnerService.alterarSpinnerStatus(false);
  }

  carregarVenda() {
    this.spinnerService.alterarSpinnerStatus(true);
    this.vendaService.getVendaById(this.idVenda).subscribe((_VENDA: Venda) => {
      this.venda = null;
      this.venda = Object.assign({}, _VENDA);

      this.venda = Object.assign(this.venda, {
        dataNegociacao: this.dataService.getDataPTBR(this.venda.dataNegociacao),
        dataFinalizado: this.dataService.getDataPTBR(this.venda.dataFinalizado)
      });

      this.vendaService.atualizarFinanceiroVenda(this.venda);
      this.vendaService.atualizarResultadoVenda(this.venda);

      if (this.venda.status === 'EM NEGOCIAÇÃO' || this.editarCampoStatus === true) {
        this.status = ['EM NEGOCIAÇÃO', 'A IMPLANTAR', 'EM IMPLANTAÇÃO', 'IMPLANTADO', 'FINALIZADO', 'DISTRATADO'];
      } else {
        this.status = ['A IMPLANTAR', 'EM IMPLANTAÇÃO', 'IMPLANTADO', 'FINALIZADO', 'DISTRATADO'];
      }

      this.produtoIdSelecionado = this.venda.vendaProdutos[0].produtosId;
      this.empresaIdSelecionado = this.venda.empresasId;
      this.vendedorIdSelecionado = this.venda.vendedorId;
      this.clienteIdSelecionado = this.venda.clientesId;
      this.statusSelecionado = this.venda.status;
      this.statusInicialSelecionado = this.venda.status;
      this.planoPagamentoIdSelecionado = this.venda.planoPagamentoId;

      this.cadastroForm.patchValue(this.venda);
      this.spinnerService.alterarSpinnerStatus(false);
      this.getAutorizacoes();
      this.carregarVendaPublicacoes();
    }, error => {
      this.spinnerService.alterarSpinnerStatus(false);
      this.toastr.error(`Erro ao tentar carregar Venda: ${error.error}`);
      console.log(error);
    });
  }

  carregarVendaPublicacoes() {
    this.spinnerService.alterarSpinnerStatus(true);
    const usuarioLogadoId = this.permissaoService.getUsuarioId();
    this.vendaService.getVendaPublicacoes(this.venda.id, usuarioLogadoId)
      .subscribe((vendaPublicacoes: VendaPublicacao[]) => {
      this.publicacoes = [];
      vendaPublicacoes.forEach((vp: VendaPublicacao) => {
        this.publicacoes.push(vp.publicacoes);
      });
      this.spinnerService.alterarSpinnerStatus(false);
    }, error => {
      this.spinnerService.alterarSpinnerStatus(false);
      console.log(error);
    });
  }

  validarForm() {
    this.cadastroForm = this.fb.group({
        id:  [''],
        numeroAno: [''],
        clientesId: ['', Validators.required],
        vendedorId: ['', Validators.required],
        empresasId: ['', Validators.required],
        produtoId: ['', Validators.required],
        planoPagamentoId: ['', Validators.required],
        status: ['', Validators.required],
        observacoes: [''],
        dataEmissao: [''],
        dataNegociacao: ['', Validators.required],
        dataFinalizado: [''],
        dataHoraUltAlt: ['']
    });
  }

  enviarNotificacoes(usuariosIdNotificacao) {
    this.spinnerService.alterarSpinnerStatus(true);
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    const notificacoes: Notificacao[] = [];
    usuariosIdNotificacao.forEach(idUsuario => {
      notificacoes.push(Object.assign({
        id: 0,
        usuarioId: idUsuario,
        dataHora: dataAtual,
        titulo: 'Autorização de Venda',
        mensagem: 'Você tem um cadastrar pedido de Autorização',
        visto: 0
      }));
    });
    this.notificacaoService.novasNotificacoes(notificacoes).subscribe(
      () => {
      notificacoes.forEach(notificacao => {
        this.socketService.sendSocket('AutorizacaoVendaGerarPedido', notificacao);
      });
      this.toastr.success('Pedido de Autorização enviado, aguarde a Resposta!');
      this.spinnerService.alterarSpinnerStatus(false);
    }, error => {
      this.spinnerService.alterarSpinnerStatus(false);
      console.log(error.error);
    });
  }

  enviarEmail(usuariosEmailNotificacao) {
    this.spinnerService.alterarSpinnerStatus(true);
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
      this.spinnerService.alterarSpinnerStatus(false);
    }, error => {
      this.spinnerService.alterarSpinnerStatus(false);
      console.log(error.error);
    });
  }

  notificarUsuariosAutorizacao() {
    this.spinnerService.alterarSpinnerStatus(true);
    const usuariosIdNotificacao = [];
    const usuariosEmailNotificacao: any = [];
    this.usuarioService.getUsuarios().subscribe(
      (_USUARIOS: Usuario[]) => {
      /*this.permissaoService.getPermissoesByFormularioAcaoObjeto(
        Object.assign({formulario: 'AUTORIZACOES', acao: 'GERAR', objeto: 'PEDIDO'})).subscribe((_PERMISSAO: Permissao) => {

         _PERMISSAO.permissaoNiveis.forEach((permissao) => {
            _USUARIOS.forEach((usuario: Usuario) => {
              if (usuario.usuarioNivel.filter(c => c.roleId === permissao.nivelId).length > 0) {
                usuariosIdNotificacao.push(usuario.id);
                usuariosEmailNotificacao.push(usuario.email);
              }
            });
          });
          this.spinnerService.alterarSpinnerStatus(false);
          this.enviarNotificacoes(usuariosIdNotificacao);
          this.enviarEmail(usuariosEmailNotificacao);
      });*/
    });
  }

  solicitarAutorizacao() {
    this.spinnerService.alterarSpinnerStatus(true);
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    const autorizacao = Object.assign({
      id: 0,
      solicitanteId: this.permissaoService.getUsuarioId(),
      formularioId: this.idVenda,
      formularioIdentificacao: this.venda.numeroAno,
      formulario: 'VENDA',
      acao: 'GERAR',
      objeto: 'PEDIDO',
      dataHoraSolicitado: dataAtual,
      autorizado: 0,
      visto: 0
    });

    this.autorizacaoService.novaAutorizacao(autorizacao).subscribe((result: any) => {
      if (result.retorno === 'OK') {
        this.spinnerService.alterarSpinnerStatus(false);
        this.notificarUsuariosAutorizacao();
      } else if (result.retorno === 'AUTORIZACAO PENDENTE') {
        this.spinnerService.alterarSpinnerStatus(false);
        this.toastr.warning(`Já existe uma autorização pendente para esta venda, aguarde.`);
      }
    }, error => {
      this.spinnerService.alterarSpinnerStatus(false);
      this.toastr.error(`Erro ao tentar solicitar autorizacao: ${error.error}`);
      console.log(error);
    });
  }

  gerarPDF() {
    this.vendaService.setPedidoVendaStatus(true);
  }

  disabledStatus() {
    if (this.venda) {
      if (this.venda.status === 'FINALIZADO' && this.editarCampoStatus !== true) {
        this.cadastroForm.get('status').disable();
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

  alterarStatusBoxInformacoes() {
    (this.statusBoxInformacoes === '') ? this.statusBoxInformacoes = ' collapsed-box' : this.statusBoxInformacoes = '';
  }

  verificarStatus() {
    if (this.cadastroForm.get('status')) {
      return this.cadastroForm.get('status').value;
    }
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

  abrirTemplateModalCliente(component, clienteId: number) {
    this.componentModal = component;
    this.inputs = Object.assign({idCliente: clienteId});
    this.templateModalClienteService.setTemplateModalStatus(true);
  }

  getTemplateModalCliente() {
    return this.templateModalClienteService.getTemplateModalStatus();
  }

  salvarAlteracoes() {
    this.spinnerService.alterarSpinnerStatus(true);
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    const dataNeg = this.cadastroForm.get('dataNegociacao').value.toLocaleString();
    const dataFin = this.cadastroForm.get('dataFinalizado').value.toLocaleString();
    const logsStatus = this.venda.vendaLogsStatus;
    if (this.statusSelecionado !== this.statusInicialSelecionado) {
      logsStatus.push(Object.assign({
        id: 0,
        vendaId: this.venda.id,
        usuarioId: this.permissaoService.getUsuarioId(),
        dataHora: dataAtual,
        status: this.statusSelecionado
      }));
    }

    this.venda = Object.assign(this.cadastroForm.value, {
      id: this.idVenda,
      dataNegociacao: this.dataService.getDataSQL(dataNeg),
      dataFinalizado: this.dataService.getDataSQL(dataFin),
      dataHoraUltAlt: dataAtual,
      empresasId: this.empresaIdSelecionado,
      clientesId: this.clienteIdSelecionado,
      produtoId: this.produtoIdSelecionado,
      vendedorId: this.vendedorIdSelecionado,
      planoPagamentoId: this.planoPagamentoIdSelecionado,
      status: this.statusSelecionado,
      vendaLogsStatus: logsStatus,
    });

    this.vendaService.editarVenda(this.venda).subscribe(
      () => {
        this.spinnerService.alterarSpinnerStatus(false);
        this.toastr.success('Editado com sucesso!');
        this.carregarVenda();
      }, error => {
        this.spinnerService.alterarSpinnerStatus(false);
        this.toastr.error(`Erro ao tentar Editar: ${error.error}`);
        console.log(error);
      });
  }

  getPedidoVenda() {
    return this.vendaService.getPedidoVendaStatus();
  }

  getProdutos() {
    this.spinnerService.alterarSpinnerStatus(true);
    this.produtoService.getProduto().subscribe(
      (_PRODUTOS: Produto[]) => {
      this.produtos = _PRODUTOS;
      this.spinnerService.alterarSpinnerStatus(false);
    }, error => {
      this.spinnerService.alterarSpinnerStatus(false);
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar produtos: ${error.error}`);
    });
  }

  getPlanoPagamento() {
    this.spinnerService.alterarSpinnerStatus(true);
    this.planoPagamentoService.getPlanoPagamento().subscribe(
      (_PLANOS: PlanoPagamento[]) => {
      this.planosPagamento = _PLANOS.filter(c => c.status !== 'INATIVO');
      this.spinnerService.alterarSpinnerStatus(false);
    }, error => {
      this.spinnerService.alterarSpinnerStatus(false);
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Planos de Pagamento: ${error.error}`);
    });
  }

  getAutorizacoes() {
    this.spinnerService.alterarSpinnerStatus(true);
    this.autorizacaoService.getAutorizacaoFormularioById(this.idVenda).subscribe(
      (_AUTORIZACOES: Autorizacao[]) => {
      this.autorizacoes = _AUTORIZACOES;
      if (this.autorizacoes.filter(c => c.autorizado === 1).length > 0) {
        this.autorizadoGerarPedido = true;
      }
      this.configurarAlteracoes();
    }, error => {
      this.spinnerService.alterarSpinnerStatus(false);
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar autorizacoes: ${error.error}`);
    });
  }

  getClientes() {
    this.spinnerService.alterarSpinnerStatus(true);
    this.clienteService.getCliente().subscribe(
      (_CLIENTES: Cliente[]) => {
      this.clientes = _CLIENTES;
      this.spinnerService.alterarSpinnerStatus(false);
    }, error => {
      this.spinnerService.alterarSpinnerStatus(false);
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar clientes: ${error.error}`);
    });
  }

  getEmpresas() {
    this.spinnerService.alterarSpinnerStatus(true);
    this.empresaService.getEmpresa().subscribe(
      (_EMPRESAS: Empresa[]) => {
      this.empresas = _EMPRESAS.filter(cliente => cliente.status !== 'INATIVO');
      this.spinnerService.alterarSpinnerStatus(false);
    }, error => {
      this.spinnerService.alterarSpinnerStatus(false);
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar empresas: ${error.error}`);
    });
  }

  getVendedores() {
    this.spinnerService.alterarSpinnerStatus(true);
    this.pessoaService.getPessoa().subscribe(
      (_PESSOAS: Pessoa[]) => {
      this.vendedores = _PESSOAS.filter(pessoa =>
        pessoa.pessoaTipos.filter(c => c.tiposPessoa.descricao === 'VENDEDOR').length > 0
        && pessoa.status !== 'INATIVO');
      this.spinnerService.alterarSpinnerStatus(false);
    }, error => {
      this.spinnerService.alterarSpinnerStatus(false);
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar vendedores: ${error.error}`);
    });
  }

}
