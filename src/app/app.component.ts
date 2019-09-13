import { Component, OnInit, AfterViewInit } from '@angular/core';
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
export class AppComponent implements OnInit, AfterViewInit {

  title = 'VirtualWeb';
  ideia: Ideia;
  cadastroIdeiaForm: FormGroup;
  notificacoes: Notificacao[];
  qtdNotificacoes: number;
  statusLogIn = false;
  idUsuario: number;
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
      listar: false
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
              private localeService: BsLocaleService,
              private toastr: ToastrService,
              private socketService: SocketService,
              private permissaoService: PermissaoService,
              private notificacaoService: NotificacaoService,
              private authService: AuthService,
              private router: Router,
              public dataService: DataService,
              private sidebarService: SidebarService) {
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
    this.idUsuario = this.permissaoService.getUsuarioId();
    if (this.idUsuario && this.verificarLogIn()) {
      this.getSocket('NotificacaoUsuarioRetorno');
      this.getSocket('AutorizacaoVendaGerarPedido');
      this.getSocket('RespAutorizacaoVendaGerarPedido');
      this.getSocket('NovaObservacao');
      this.getNotificacoes();
    }
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

  ngAfterViewInit() {
    if (this.logou === true) {
      this.permissaoService.getAllPermissoes().subscribe((_PERMISSOES: Permissao[]) => {
        this.filtrarPermissao('Permissões').listar =
        this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.formulario === 'PERMISSOES' && c.acao === 'LISTAR')[0]);

        this.filtrarPermissao('Pessoas').listar =
        this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.formulario === 'PESSOAS' && c.acao === 'LISTAR')[0]);

        this.filtrarPermissao('Clientes').listar =
        this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.formulario === 'CLIENTES' && c.acao === 'LISTAR')[0]);

        this.filtrarPermissao('Produtos').listar =
        this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.formulario === 'PRODUTOS' && c.acao === 'LISTAR')[0]);

        this.filtrarPermissao('Plano de Contas').listar =
        this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.formulario === 'PLANO DE CONTAS' && c.acao === 'LISTAR')[0]);

        this.filtrarPermissao('Centro de Receita').listar =
        this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.formulario === 'CENTRO DE RECEITA' && c.acao === 'LISTAR')[0]);

        this.filtrarPermissao('Centro de Despesa').listar =
        this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.formulario === 'CENTRO DE DESPESA' && c.acao === 'LISTAR')[0]);

        this.filtrarPermissao('Plano de Pagamento').listar =
        this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.formulario === 'PLANO DE PAGAMENTO' && c.acao === 'LISTAR')[0]);

        this.filtrarPermissao('Forma de Pagamento').listar =
        this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.formulario === 'FORMA DE PAGAMENTO' && c.acao === 'LISTAR')[0]);

        this.filtrarPermissao('Recebimentos').listar =
        this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.formulario === 'RECEBIMENTOS' && c.acao === 'LISTAR')[0]);

        this.filtrarPermissao('Pagamentos').listar =
        this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.formulario === 'PAGAMENTOS' && c.acao === 'LISTAR')[0]);

        this.filtrarPermissao('Lançamentos').listar =
        this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.formulario === 'LANÇAMENTOS' && c.acao === 'LISTAR')[0]);

        this.filtrarPermissao('Relatórios Lançamentos').listar =
        this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.formulario === 'RELATÓRIOS LANÇAMENTOS'
        && c.acao === 'LISTAR')[0]);

        this.filtrarPermissao('Cheques Pré-Datado').listar =
        this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.formulario === 'CHEQUES PRE-DATADO' && c.acao === 'LISTAR')[0]);

        this.filtrarPermissao('Financeiro').listar =
        this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.formulario === 'FINANCEIRO' && c.acao === 'LISTAR')[0]);

        this.filtrarPermissao('Minhas Empresas').listar =
        this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.formulario === 'EMPRESAS' && c.acao === 'LISTAR')[0]);

        this.filtrarPermissao('Autorizações').listar =
        this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.formulario === 'AUTORIZACOES' && c.acao === 'LISTAR')[0]);

        this.filtrarPermissao('Venda').listar =
        this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.formulario === 'VENDA' && c.acao === 'LISTAR')[0]);

        this.filtrarPermissao('Movimentos').listar =
        this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.formulario === 'VENDA' && c.acao === 'LISTAR')[0]);

        this.filtrarPermissao('Relatórios Venda').listar =
        this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.formulario === 'RELATÓRIOS VENDA' && c.acao === 'LISTAR')[0]);

      });
    }
  }

  verificarPermissao(component: string) {
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
        this.ngAfterViewInit();
      }
      return true;
    } else {
      this.sidebar = 'sidebar-collapse sidebar-closed';
      this.logou = false;
      return false;
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.toastr.show('Log Out.');
    this.router.navigate(['/usuarios/login']);
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
    this.notificacaoService.getAllNotificacoesByUsuarioId(this.idUsuario).subscribe(
      (_NOTIFICACOES: Notificacao[]) => {
      this.notificacoes = _NOTIFICACOES;
      this.qtdNotificacoes = _NOTIFICACOES.length;
    }, error => {
      this.toastr.error(`Erro ao tentar carregar notificacoes: ${error}`);
    });
  }

  getSocket(evento: string) {
    this.socketService.getSocket(evento).subscribe((data: any) => {
      if (data) {
        if (evento === 'NovaObservacao') {
          const  notification = new Notification(`Olá, ${this.permissaoService.getUsuario()} !`, {
            body: `O usuário ${data.usuario} adicionou\numa nova observação no Retorno ${data.retornoId}.`
          });
        } else if (evento === 'NotificacaoUsuarioRetorno') {
          if (Number(data) === Number(this.idUsuario)) {
            const  notification = new Notification(`Retorno Específico!`, {
              body: 'Foi adicionado um Novo Retorno específico para você!'
            });
            this.getNotificacoes();
          }
        } else if (evento === 'AutorizacaoVendaGerarPedido') {
          if (Number(data) === Number(this.idUsuario)) {
            const  notification = new Notification(`Autorização Pedido de Venda!`, {
              body: 'Um novo Pedido de Venda precisa ser Autorizado!'
            });
            this.getNotificacoes();
          }
        } else if (evento === 'RespAutorizacaoVendaGerarPedido') {
          if (Number(data.solicitanteId) === Number(this.idUsuario)) {
            const  notification = new Notification(`Resposta Autorização Pedido de Venda!`, {
              body: (data.autorizado === 1) ? `Seu pedido de Venda foi autorizado pelo Usuário: ${data.autorizadorNome}.` :
                                              `Seu pedido de Venda foi negado pelo Usuário: ${data.autorizadorNome}.`
            });
            this.getNotificacoes();
          }
        }
      }
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
