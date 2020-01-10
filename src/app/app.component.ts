import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { BsLocaleService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
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

  title = 'RoboGrow';
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
      component: 'Permissões',
      listar: true
    },
    {
      component: 'Produtos',
      listar: false
    },
  ];

  constructor(private spinner: NgxSpinnerService,
              private spinnerService: SpinnerService,
              private localeService: BsLocaleService,
              private toastr: ToastrService,
              private permissaoService: PermissaoService,
              private notificacaoService: NotificacaoService,
              private authService: AuthService,
              public dataService: DataService,
              private sidebarService: SidebarService,
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

    this.usuarioLogadoId = this.permissaoService.getUsuarioId();
    if (this.usuarioLogadoId && this.usuarioLogadoId !== null && this.verificarLogIn()) {
      this.getSocket('NovoRetornoEspecifico');
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
        // this.carregarPermissoes();
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
    /*this.socketService.getSocket(evento).subscribe((info: any) => {
      if (info) {
        if (info.notificadoId === this.usuarioLogadoId || info.notificadoId === 0) {
          const  notification = new Notification('', {body: info.acao});
        }

        if (evento === 'NovaPublicacao') {
          this.notificacaoService.atualizarNotificacoes();
        }
      }
      this.getNotificacoes();
    });*/
  }
}
