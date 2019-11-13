import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { IdeiaService } from './_services/Cadastros/Ideias/ideia.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { BsLocaleService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Ideia } from './_models/Cadastros/Ideias/ideia';
import * as moment from 'moment';
import { SocketService } from './_services/WebSocket/Socket.service';
import { PermissaoService } from './_services/Permissoes/permissao.service';
import { Notificacao } from './_models/Notificacoes/notificacao';
import { NotificacaoService } from './_services/Notificacoes/notificacao.service';
import { AuthService } from './_services/Cadastros/Login/auth.service';
import { Router } from '@angular/router';
import { DataService } from './_services/Cadastros/Uteis/data.service';
import { Permissao } from './_models/Permissoes/permissao';
import { SidebarService } from './sidebar/sidebar.service';
import { PublicacaoService } from './_services/Publicacoes/publicacao.service';
import { VendaService } from './_services/Movimentos/Venda/venda.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerService } from './_services/Uteis/Spinner/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('slide', [
      state('up', style({ height: 0 })),
      state('down', style({ height: '*' })),
      transition('up <=> down', animate(200))
    ])
  ]
})
export class AppComponent implements OnInit, AfterViewChecked {

  title = 'VirtualWeb';
  ideia: Ideia;
  cadastroIdeiaForm: FormGroup;
  notificacoes: Notificacao[];
  qtdNotificacoes: number;
  statusLogIn = false;
  usuarioLogadoId: number;
  paginaNotificacaoAtual = 1;
  logou = false;
  sidebar = 'sidebar-collapse sidebar-closed';

  menus = [];

  permissoes = [
    {
      component: 'Movimentos',
      listar: false
    },
    {
      component: 'Autorizações',
      listar: false
    },
    {
      component: 'Permissões',
      listar: true
    },
    {
      component: 'Venda',
      listar: false
    },
    {
      component: 'Relatórios Venda',
      listar: false
    },
    {
      component: 'Clientes',
      listar: false
    },
    {
      component: 'Minhas Empresas',
      listar: false
    },
    {
      component: 'Produtos',
      listar: false
    },
    {
      component: 'Pessoas',
      listar: false
    },
    {
      component: 'Plano de Contas',
      listar: false
    },
    {
      component: 'Centro de Receita',
      listar: false
    },
    {
      component: 'Centro de Despesa',
      listar: false
    },
    {
      component: 'Plano de Pagamento',
      listar: false
    },
    {
      component: 'Forma de Pagamento',
      listar: false
    },
    {
      component: 'Financeiro',
      listar: false
    },
    {
      component: 'Recebimentos',
      listar: false
    },
    {
      component: 'Pagamentos',
      listar: false
    },
    {
      component: 'Lançamentos',
      listar: false
    },
    {
      component: 'Relatórios Lançamentos',
      listar: false
    },
    {
      component: 'Cheques Pré-Datado',
      listar: false
    },
  ];

  constructor(private ideiaService: IdeiaService,
              private fb: FormBuilder,
              private spinner: NgxSpinnerService,
              private spinnerService: SpinnerService,
              private localeService: BsLocaleService,
              private toastr: ToastrService,
              private socketService: SocketService,
              private permissaoService: PermissaoService,
              private notificacaoService: NotificacaoService,
              private authService: AuthService,
              private router: Router,
              public dataService: DataService,
              private sidebarService: SidebarService,
              private publicacaoService: PublicacaoService,
              private vendaService: VendaService,
              private changeDetectionRef: ChangeDetectorRef) {
    this.spinnerService.spinnerStatus.subscribe((status: boolean) => {
      if (status === true) {
        this.spinner.show();
      } else {
        this.spinner.hide();
      }
    });
    this.localeService.use('pt-br');
    this.menus = sidebarService.getMenuList();
  }

  ngOnInit() {

    if (!('Notification' in window)) {
      alert('This browser does not support system notifications');
    } else if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    this.validation();
    this.usuarioLogadoId = this.permissaoService.getUsuarioId();
    if (this.usuarioLogadoId && this.usuarioLogadoId !== null && this.verificarLogIn()) {
      this.getSocket('NovoRetornoEspecifico');
      this.getSocket('AutorizacaoVendaGerarPedido');
      this.getSocket('RespAutorizacaoVendaGerarPedido');
      this.getSocket('NovaObservacao');
      this.getSocket('NovaPublicacao');
      this.getSocket('NovoComentarioPublicacao');
      this.getNotificacoes();
    } else {
      this.logout();
    }
  }

  ngAfterViewChecked() {
    this.changeDetectionRef.detectChanges();
  }

  getUrlUsuarioLogadoFotoPerfil(): string {
    return this.permissaoService.getUrlUsuarioLogadoFotoPerfil();
  }

  getSideBarState() {
    return this.sidebarService.getSidebarState();
  }

  toggle(currentMenu) {
    if (currentMenu.type === 'dropdown') {
      this.menus.forEach(element => {
        if (element === currentMenu) {
          currentMenu.active = !currentMenu.active;
        } else {
          element.active = false;
        }
      });
    }
  }

  getState(currentMenu) {

    if (currentMenu.active) {
      return 'down';
    } else {
      return 'up';
    }
  }

  filtrarPermissao(component: string) {
    return this.permissoes.filter(c => c.component === component)[0];
  }

  carregarPermissoes() {
    if (this.logou === true) {
      this.spinnerService.alterarSpinnerStatus(true);
      this.permissaoService.getPermissaoFormulariosByNivelId().subscribe((permissoes: Permissao[]) => {

        let permissaoObjetos = permissoes.filter(f => f.formulario === 'PERMISSÕES')[0].permissaoObjetos;
        let permissaoFormulario = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'FORMULÁRIO');
        this.filtrarPermissao('Permissões').listar = (permissaoFormulario !== null ) ? permissaoFormulario.listar : false;

        permissaoObjetos = permissoes.filter(f => f.formulario === 'PESSOAS')[0].permissaoObjetos;
        permissaoFormulario = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'FORMULÁRIO');
        this.filtrarPermissao('Pessoas').listar = (permissaoFormulario !== null ) ? permissaoFormulario.listar : false;

        permissaoObjetos = permissoes.filter(f => f.formulario === 'CLIENTES')[0].permissaoObjetos;
        permissaoFormulario = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'FORMULÁRIO');
        this.filtrarPermissao('Clientes').listar = (permissaoFormulario !== null ) ? permissaoFormulario.listar : false;

        permissaoObjetos = permissoes.filter(f => f.formulario === 'PRODUTOS')[0].permissaoObjetos;
        permissaoFormulario = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'FORMULÁRIO');
        this.filtrarPermissao('Produtos').listar = (permissaoFormulario !== null ) ? permissaoFormulario.listar : false;

        permissaoObjetos = permissoes.filter(f => f.formulario === 'PLANO DE CONTAS')[0].permissaoObjetos;
        permissaoFormulario = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'FORMULÁRIO');
        this.filtrarPermissao('Plano de Contas').listar = (permissaoFormulario !== null ) ? permissaoFormulario.listar : false;

        permissaoObjetos = permissoes.filter(f => f.formulario === 'CENTRO DE RECEITAS')[0].permissaoObjetos;
        permissaoFormulario = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'FORMULÁRIO');
        this.filtrarPermissao('Centro de Receita').listar = (permissaoFormulario !== null ) ? permissaoFormulario.listar : false;

        permissaoObjetos = permissoes.filter(f => f.formulario === 'CENTRO DE DESPESAS')[0].permissaoObjetos;
        permissaoFormulario = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'FORMULÁRIO');
        this.filtrarPermissao('Centro de Despesa').listar = (permissaoFormulario !== null ) ? permissaoFormulario.listar : false;

        permissaoObjetos = permissoes.filter(f => f.formulario === 'PLANOS DE PAGAMENTO')[0].permissaoObjetos;
        permissaoFormulario = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'FORMULÁRIO');
        this.filtrarPermissao('Plano de Pagamento').listar = (permissaoFormulario !== null ) ? permissaoFormulario.listar : false;

        permissaoObjetos = permissoes.filter(f => f.formulario === 'FORMAS DE PAGAMENTO')[0].permissaoObjetos;
        permissaoFormulario = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'FORMULÁRIO');
        this.filtrarPermissao('Forma de Pagamento').listar = (permissaoFormulario !== null ) ? permissaoFormulario.listar : false;

        permissaoObjetos = permissoes.filter(f => f.formulario === 'CHEQUES PRÉ-DATADO')[0].permissaoObjetos;
        permissaoFormulario = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'FORMULÁRIO');
        this.filtrarPermissao('Cheques Pré-Datado').listar = (permissaoFormulario !== null ) ? permissaoFormulario.listar : false;

        permissaoObjetos = permissoes.filter(f => f.formulario === 'EMPRESAS')[0].permissaoObjetos;
        permissaoFormulario = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'FORMULÁRIO');
        this.filtrarPermissao('Minhas Empresas').listar = (permissaoFormulario !== null ) ? permissaoFormulario.listar : false;

        permissaoObjetos = permissoes.filter(f => f.formulario === 'AUTORIZAÇÕES')[0].permissaoObjetos;
        permissaoFormulario = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'FORMULÁRIO');
        this.filtrarPermissao('Autorizações').listar = (permissaoFormulario !== null ) ? permissaoFormulario.listar : false;

        permissaoObjetos = permissoes.filter(f => f.formulario === 'VENDAS')[0].permissaoObjetos;
        permissaoFormulario = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'FORMULÁRIO');
        this.filtrarPermissao('Venda').listar = (permissaoFormulario !== null ) ? permissaoFormulario.listar : false;

        permissaoObjetos = permissoes.filter(f => f.formulario === 'RELATÓRIOS VENDAS')[0].permissaoObjetos;
        permissaoFormulario = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'FORMULÁRIO');
        this.filtrarPermissao('Relatórios Venda').listar = (permissaoFormulario !== null ) ? permissaoFormulario.listar : false;

        permissaoObjetos = permissoes.filter(f => f.formulario === 'RECEBIMENTOS')[0].permissaoObjetos;
        permissaoFormulario = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'FORMULÁRIO');
        this.filtrarPermissao('Recebimentos').listar = (permissaoFormulario !== null ) ? permissaoFormulario.listar : false;

        permissaoObjetos = permissoes.filter(f => f.formulario === 'PAGAMENTOS')[0].permissaoObjetos;
        permissaoFormulario = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'FORMULÁRIO');
        this.filtrarPermissao('Pagamentos').listar = (permissaoFormulario !== null ) ? permissaoFormulario.listar : false;

        permissaoObjetos = permissoes.filter(f => f.formulario === 'LANÇAMENTOS')[0].permissaoObjetos;
        permissaoFormulario = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'FORMULÁRIO');
        this.filtrarPermissao('Lançamentos').listar = (permissaoFormulario !== null ) ? permissaoFormulario.listar : false;

        permissaoObjetos = permissoes.filter(f => f.formulario === 'RELATÓRIOS LANÇAMENTOS')[0].permissaoObjetos;
        permissaoFormulario = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'FORMULÁRIO');
        this.filtrarPermissao('Relatórios Lançamentos').listar = (permissaoFormulario !== null ) ? permissaoFormulario.listar : false;

        this.filtrarPermissao('Movimentos').listar =
        (this.filtrarPermissao('Venda').listar === true || this.filtrarPermissao('Relatórios Venda').listar === true) ? true : false;

        this.filtrarPermissao('Financeiro').listar =
        (this.filtrarPermissao('Relatórios Lançamentos').listar === true || this.filtrarPermissao('Pagamentos').listar === true ||
         this.filtrarPermissao('Recebimentos').listar === true || this.filtrarPermissao('Lançamentos').listar === true) ? true : false;

        this.spinnerService.alterarSpinnerStatus(false);
      }, error => {
        this.spinnerService.alterarSpinnerStatus(false);
        console.log(error.error);
      });
    }
  }

  verificarPermissaoPorObjetos(component: string) {
    if (this.permissoes.filter(c => c.component === component).length > 0) {
      return this.permissoes.filter(c => c.component === component)[0].listar;
    } else {
      return true;
    }
  }

  alterarSidebar() {
    (this.sidebar === 'sidebar-collapse sidebar-closed') ? this.sidebar = 'sidebar-open' : this.sidebar = 'sidebar-collapse sidebar-closed';

  }

  verificarLogIn() {
    if (this.authService.loggerIn()) {
      if (this.logou === false) {
        this.logou = true;
        this.sidebar = 'sidebar-open';
        this.carregarPermissoes();
      }
      return true;
    } else {
      this.sidebar = 'sidebar-collapse sidebar-closed';
      this.logou = false;
      return false;
    }
  }

  logout() {
    this.authService.logout();
    setTimeout(() => { this.toastr.show('Log Out.'); });
  }

  usuarioNome() {
    return this.permissaoService.getUsuario();
  }

  usuarioId() {
    return this.permissaoService.getUsuarioId();
  }

  getQtdNotificacoes() {
    if (this.notificacoes) {
      return this.notificacoes.filter(c => c.visto === 0).length;
    } else {
      return 0;
    }
  }

  getDiferencaDataHora(dataHora: any) {
    return this.dataService.calculaDiferencaDataHora(this.dataService.getDataPTBR(dataHora));
  }

  setarVistoNotificacao(notificacao: any) {
    this.notificacaoService.editarVistoNotificacao(notificacao).subscribe(
      () => {
        this.getNotificacoes();
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar setar notificacoes: ${error}`);
    });
  }

  getNotificacoes() {
    /*this.spinnerService.alterarSpinnerStatus(true);
    this.notificacaoService.getNotificacoesByUsuarioId(this.usuarioLogadoId).subscribe(
      (_NOTIFICACOES: Notificacao[]) => {
      this.notificacoes = _NOTIFICACOES;
      this.qtdNotificacoes = _NOTIFICACOES.length;
      this.spinnerService.alterarSpinnerStatus(false);
    }, error => {
      this.spinnerService.alterarSpinnerStatus(false);
      this.toastr.error(`Erro ao tentar carregar notificacoes: ${error}`);
    });*/
  }

  getSocket(evento: string) {
    this.socketService.getSocket(evento).subscribe((info: any) => {
      if (info) {
        if (info.notificadoId === this.usuarioLogadoId || info.notificadoId === 0) {
          const  notification = new Notification('', {body: info.acao});
        }

        if (evento === 'NovoComentarioPublicacao') {
          this.notificacaoService.atualizarNotificacoes();
          this.publicacaoService.atualizarPublicacaoComentarios(info.publicacaoId);
        }

        if (evento === 'NovaPublicacao') {
          this.notificacaoService.atualizarNotificacoes();
          this.vendaService.atualizarPublicacoesVenda();
        }
      }
      this.getNotificacoes();
    });
  }

  validation() {
    this.cadastroIdeiaForm = this.fb.group({
        id:  [''],
        usuarioId: [''],
        ideia: ['', Validators.required],
        dataCadastro: [''],
        status: ['']
    });
  }

  cadastrarIdeia(template: any) {
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    this.ideia = Object.assign(this.cadastroIdeiaForm.value, {id: 0, usuarioId: this.permissaoService.getUsuarioId(),
       dataCadastro: dataAtual, status: 'EM ANALISE'});
    this.ideiaService.novaIdeia(this.ideia).subscribe(
      () => {
        this.toastr.success('Ideia enviada com Sucesso!');
        template.hide();
      }, error => {
        console.log(error.error);
      }
    );
  }

}
