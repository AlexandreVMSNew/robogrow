import { Component, OnInit, ChangeDetectorRef, AfterViewChecked, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { VendaService } from 'src/app/_services/Movimentos/Venda/venda.service';
import { ActivatedRoute } from '@angular/router';
import { Venda } from 'src/app/_models/Movimentos/Venda/Venda';
import { ProdutoItem } from 'src/app/_models/Cadastros/Produtos/produtoItem';
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
  visualizarResultado = false;
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

  status = ['EM NEGOCIAÇÃO', 'EM IMPLANTAÇÃO', 'IMPLANTADO', 'FINALIZADO', 'DISTRATADO'];
  statusSelecionado: string;

  planosPagamento: PlanoPagamento[];
  planoPagamentoIdSelecionado: any;

  autorizacoes: Autorizacao[];

  statusBoxInformacoes = '';

  bsConfig: Partial<BsDatepickerConfig> = Object.assign({}, { containerClass: 'theme-dark-blue' });
  constructor(private fb: FormBuilder,
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
      this.visualizarResultado = this.permissaoService
          .verificarPermissao(_PERMISSOES.filter(c => c.acao === 'VISUALIZAR' && c.objeto === 'RESUMO')[0]);
      this.gerarPedido = this.permissaoService
          .verificarPermissao(_PERMISSOES.filter(c => c.acao === 'GERAR PEDIDO')[0]);

      const form = this.cadastroForm.controls;
      if (this.editar) {
        form.empresasId.enable(); form.vendedorId.enable(); form.clientesId.enable(); form.produtoId.enable();
      } else {
        form.empresasId.disable(); form.vendedorId.disable(); form.clientesId.disable(); form.produtoId.disable();
      }

      form.dataFinalizado.disable();
      (this.editarDataNegociacao || form.status.value === 'EM NEGOCIAÇÃO') ? form.dataNegociacao.enable() : form.dataNegociacao.disable();
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
          this.vendaService.atualizarFinanceiroVenda();
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
