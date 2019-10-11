import { Component, OnInit, ChangeDetectorRef, AfterViewChecked, AfterViewInit } from '@angular/core';
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
  visualizarResultado = false;
  visualizarFinanceiro = false;
  visualizar = false;
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

  idVenda: number;
  venda: Venda;

  status = [''];
  statusSelecionado: string;

  planosPagamento: PlanoPagamento[];
  planoPagamentoIdSelecionado: any;

  autorizacoes: Autorizacao[];

  statusBoxInformacoes = '';

  gruposCheckList: ProdutoGrupoChecks[] = [];
  checks: ProdutoCheckList[] = [];
  checksOpcoes: ProdutoCheckListOpcoes[] = [];

  editarClienteComponent = EditarClienteComponent;
  inputs: any;
  componentModal: any;

  bsConfig: Partial<BsDatepickerConfig> = Object.assign({}, { containerClass: 'theme-dark-blue' });
  constructor(private fb: FormBuilder,
              private templateModalService: TemplateModalService,
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
              }

  ngOnInit() {
    this.idVenda = +this.router.snapshot.paramMap.get('id');
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
    this.permissaoService.getPermissoesByFormulario(
      Object.assign({formulario: 'VENDA'})).subscribe((_PERMISSOES: Permissao[]) => {

      this.editar = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'EDITAR')[0]);
      this.editarValorPrevisto = this.permissaoService
          .verificarPermissao(_PERMISSOES.filter(c => c.acao === 'LANÇAR' && c.objeto === 'VALOR PREVISTO')[0]);
      this.editarValorRealizado = this.permissaoService
          .verificarPermissao(_PERMISSOES.filter(c => c.acao === 'LANÇAR' && c.objeto === 'VALOR REALIZADO')[0]);
      this.editarDataNegociacao = this.permissaoService
          .verificarPermissao(_PERMISSOES.filter(c => c.acao === 'EDITAR' && c.objeto === 'DATA NEGOCIAÇÃO')[0]);
      this.editarStatus = this.permissaoService
          .verificarPermissao(_PERMISSOES.filter(c => c.acao === 'EDITAR' && c.objeto === 'STATUS')[0]);
      this.visualizar = this.permissaoService
          .verificarPermissao(_PERMISSOES.filter(c => c.acao === 'VISUALIZAR')[0]);
      this.visualizarResultado = this.permissaoService
          .verificarPermissao(_PERMISSOES.filter(c => c.acao === 'VISUALIZAR' && c.objeto === 'RESUMO')[0]);
      this.visualizarFinanceiro = this.permissaoService
          .verificarPermissao(_PERMISSOES.filter(c => c.acao === 'VISUALIZAR' && c.objeto === 'FINANCEIRO')[0]);
      this.gerarPedido = this.permissaoService
          .verificarPermissao(_PERMISSOES.filter(c => c.acao === 'GERAR' && c.objeto === 'PEDIDO')[0]);
      this.carregarVenda();
    });

  }

  configurarAlteracoes() {
    if (this.editar === true || this.statusSelecionado === 'EM NEGOCIAÇÃO') {
      this.cadastroForm.controls.empresasId.enable(); this.cadastroForm.controls.vendedorId.enable();
      this.cadastroForm.controls.clientesId.enable(); this.cadastroForm.controls.produtoId.enable();
      this.cadastroForm.controls.planoPagamentoId.enable();
    } else {
      this.cadastroForm.controls.empresasId.disable(); this.cadastroForm.controls.vendedorId.disable();
      this.cadastroForm.controls.clientesId.disable(); this.cadastroForm.controls.produtoId.disable();
      this.cadastroForm.controls.planoPagamentoId.disable();
    }

    (this.editarDataNegociacao === true || this.statusSelecionado === 'EM NEGOCIAÇÃO') ?
      this.cadastroForm.controls.dataNegociacao.enable() : this.cadastroForm.controls.dataNegociacao.disable();

    (this.editarStatus === true || this.autorizadoGerarPedido === true) ?
      this.cadastroForm.controls.status.enable() : this.cadastroForm.controls.status.disable();
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

          if (this.venda.status === 'EM NEGOCIAÇÃO' || this.editarStatus === true) {
            this.status = ['EM NEGOCIAÇÃO', 'A IMPLANTAR', 'EM IMPLANTAÇÃO', 'FINALIZADO', 'DISTRATADO'];
          } else {
            this.status = ['A IMPLANTAR', 'EM IMPLANTAÇÃO', 'FINALIZADO', 'DISTRATADO'];
          }
          this.produtoIdSelecionado = this.venda.vendaProdutos[0].produtosId;
          this.empresaIdSelecionado = this.venda.empresasId;
          this.vendedorIdSelecionado = this.venda.vendedorId;
          this.clienteIdSelecionado = this.venda.clientesId;
          this.statusSelecionado = this.venda.status;

          this.cadastroForm.patchValue(this.venda);
          this.getAutorizacoes();
          this.vendaService.atualizarFinanceiroVenda();
          this.vendaService.atualizarResultadoVenda();
        }, error => {
          this.toastr.error(`Erro ao tentar carregar Venda: ${error.error}`);
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


  enviarNotificacoesAutorizacao() {
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    const usuariosIdNotificacao = [];
    const usuariosEmailNotificacao: any = [];
    this.usuarioService.getAllUsuario().subscribe(
      (_USUARIOS: Usuario[]) => {
      this.permissaoService.getPermissoesByFormularioAcaoObjeto(
        Object.assign({formulario: 'AUTORIZACOES', acao: 'GERAR', objeto: 'PEDIDO'})).subscribe((_PERMISSAO: Permissao) => {
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
        const notificacoes: Notificacao[] = [];
        usuariosIdNotificacao.forEach(idUsuario => {
          notificacoes.push(Object.assign({
            id: 0,
            usuarioId: idUsuario,
            dataHora: dataAtual,
            titulo: 'Autorização de Venda',
            mensagem: 'Você tem um novo pedido de Autorização',
            visto: 0
          }));
        });
        this.notificacaoService.novasNotificacoes(notificacoes).subscribe(
          () => {
          notificacoes.forEach(notificacao => {
            this.socketService.sendSocket('AutorizacaoVendaGerarPedido', notificacao);
          });
          this.toastr.success('Pedido de Autorização enviado, aguarde a Resposta!');
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
      formularioIdentificacao: this.venda.numeroAno,
      formulario: 'VENDA',
      acao: 'GERAR',
      objeto: 'PEDIDO',
      dataHoraSolicitado: dataAtual,
      autorizado: 0,
      visto: 0
    });
    console.log(autorizacao);
    this.autorizacaoService.novaAutorizacao(autorizacao).subscribe((result: any) => {
      if (result.retorno === 'OK') {
        this.enviarNotificacoesAutorizacao();
      } else if (result.retorno === 'AUTORIZACAO PENDENTE') {
        this.toastr.warning(`Já existe uma autorização pendente para esta venda, aguarde.`);
      }
    }, error => {
      this.toastr.error(`Erro ao tentar solicitar autorizacao: ${error.error}`);
      console.log(error);
    });
  }

  gerarPDF() {
    this.vendaService.setPedidoVendaStatus(true);
  }

  disabledStatus() {
    if (this.venda) {
      if (this.venda.status === 'FINALIZADO') {
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

  abrirTemplateModal(component, clienteId: number) {
    this.componentModal = component;
    this.inputs = Object.assign({idCliente: clienteId});
    this.templateModalService.setTemplateModalStatus(true);
  }

  getTemplateModal() {
    return this.templateModalService.getTemplateModalStatus();
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
      clientesId: this.clienteIdSelecionado,
      produtoId: this.produtoIdSelecionado,
      vendedorId: this.vendedorIdSelecionado,
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

  getPedidoVenda() {
    return this.vendaService.getPedidoVendaStatus();
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

  getPlanoPagamento() {
    this.planoPagamentoService.getAllPlanoPagamento().subscribe(
      (_PLANOS: PlanoPagamento[]) => {
      this.planosPagamento = _PLANOS.filter(c => c.status !== 'INATIVO');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Planos de Pagamento: ${error.error}`);
    });
  }

  getAutorizacoes() {
    this.autorizacaoService.getAutorizacaoFormularioById(this.idVenda).subscribe(
      (_AUTORIZACOES: Autorizacao[]) => {
      this.autorizacoes = _AUTORIZACOES;
      if (this.autorizacoes.filter(c => c.autorizado === 1).length > 0) {
        this.autorizadoGerarPedido = true;
      }
      this.configurarAlteracoes();
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar autorizacoes: ${error.error}`);
    });
  }

  getClientes() {
    this.clienteService.getAllCliente().subscribe(
      (_CLIENTES: Cliente[]) => {
      this.clientes = _CLIENTES;
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
