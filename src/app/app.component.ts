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
  sidebar = 'sidebar-open';

  menus = [];

  permissoes = [
    {
      component: 'Movimentos',
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
    this.getSocket('NotificacaoUsuarioRetorno');
    this.getSocket('NovaObservacao');
    this.idUsuario = this.permissaoService.getUsuarioId();
    if (this.idUsuario && this.verificarLogIn()) {
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

  ngAfterViewInit() {
    if (this.logou === true) {
      this.permissaoService.getPermissoesByFormularioAcaoObjeto('PERMISSOES', 'LISTAR').subscribe((_PERMISSAO: Permissao) => {
        this.permissoes.filter(c => c.component === 'Permissões')[0].listar = this.permissaoService.verificarPermissao(_PERMISSAO);
      });
      this.permissaoService.getPermissoesByFormularioAcaoObjeto('PESSOAS', 'LISTAR').subscribe((_PERMISSAO: Permissao) => {
        this.permissoes.filter(c => c.component === 'Pessoas')[0].listar = this.permissaoService.verificarPermissao(_PERMISSAO);
      });
      this.permissaoService.getPermissoesByFormularioAcaoObjeto('CLIENTES', 'LISTAR').subscribe((_PERMISSAO: Permissao) => {
        this.permissoes.filter(c => c.component === 'Clientes')[0].listar = this.permissaoService.verificarPermissao(_PERMISSAO);
      });
      this.permissaoService.getPermissoesByFormularioAcaoObjeto('PRODUTOS', 'LISTAR').subscribe((_PERMISSAO: Permissao) => {
        this.permissoes.filter(c => c.component === 'Produtos')[0].listar = this.permissaoService.verificarPermissao(_PERMISSAO);
      });
      this.permissaoService.getPermissoesByFormularioAcaoObjeto('PLANO DE CONTAS', 'LISTAR').subscribe((_PERMISSAO: Permissao) => {
        this.permissoes.filter(c => c.component === 'Plano de Contas')[0].listar = this.permissaoService.verificarPermissao(_PERMISSAO);
      });
      this.permissaoService.getPermissoesByFormularioAcaoObjeto('CENTRO DE RECEITA', 'LISTAR').subscribe((_PERMISSAO: Permissao) => {
        this.permissoes.filter(c => c.component === 'Centro de Receita')[0].listar = this.permissaoService.verificarPermissao(_PERMISSAO);
      });
      this.permissaoService.getPermissoesByFormularioAcaoObjeto('CENTRO DE DESPESA', 'LISTAR').subscribe((_PERMISSAO: Permissao) => {
        this.permissoes.filter(c => c.component === 'Centro de Despesa')[0].listar = this.permissaoService.verificarPermissao(_PERMISSAO);
      });
      this.permissaoService.getPermissoesByFormularioAcaoObjeto('PLANO DE PAGAMENTO', 'LISTAR').subscribe((_PERMISSAO: Permissao) => {
        this.permissoes.filter(c => c.component === 'Plano de Pagamento')[0].listar = this.permissaoService.verificarPermissao(_PERMISSAO);
      });
      this.permissaoService.getPermissoesByFormularioAcaoObjeto('FORMA DE PAGAMENTO', 'LISTAR').subscribe((_PERMISSAO: Permissao) => {
        this.permissoes.filter(c => c.component === 'Forma de Pagamento')[0].listar = this.permissaoService.verificarPermissao(_PERMISSAO);
      });

      this.permissaoService.getPermissoesByFormularioAcaoObjeto('RECEBIMENTOS', 'LISTAR').subscribe((_PERMISSAO: Permissao) => {
        this.permissoes.filter(c => c.component === 'Recebimentos')[0].listar = this.permissaoService.verificarPermissao(_PERMISSAO);
      });
      this.permissaoService.getPermissoesByFormularioAcaoObjeto('PAGAMENTOS', 'LISTAR').subscribe((_PERMISSAO: Permissao) => {
        this.permissoes.filter(c => c.component === 'Pagamentos')[0].listar = this.permissaoService.verificarPermissao(_PERMISSAO);
      });
      this.permissaoService.getPermissoesByFormularioAcaoObjeto('LANÇAMENTOS', 'LISTAR').subscribe((_PERMISSAO: Permissao) => {
        this.permissoes.filter(c => c.component === 'Lançamentos')[0].listar = this.permissaoService.verificarPermissao(_PERMISSAO);
      });
      this.permissaoService.getPermissoesByFormularioAcaoObjeto('RELATÓRIOS LANÇAMENTOS', 'LISTAR').subscribe((_PERMISSAO: Permissao) => {
        // tslint:disable-next-line:max-line-length
        this.permissoes.filter(c => c.component === 'Relatórios Lançamentos')[0].listar = this.permissaoService.verificarPermissao(_PERMISSAO);
      });
      this.permissaoService.getPermissoesByFormularioAcaoObjeto('CHEQUES PRE-DATADO', 'LISTAR').subscribe((_PERMISSAO: Permissao) => {
        this.permissoes.filter(c => c.component === 'Cheques Pré-Datado')[0].listar = this.permissaoService.verificarPermissao(_PERMISSAO);
      });

      this.permissaoService.getPermissoesByFormularioAcaoObjeto('FINANCEIRO', 'VISUALIZAR').subscribe((_PERMISSAO: Permissao) => {
        this.permissoes.filter(c => c.component === 'Financeiro')[0].listar = this.permissaoService.verificarPermissao(_PERMISSAO);
      });

      this.permissaoService.getPermissoesByFormularioAcaoObjeto('VENDA', 'LISTAR').subscribe((_PERMISSAO: Permissao) => {
        this.permissoes.filter(c => c.component === 'Venda')[0].listar = this.permissaoService.verificarPermissao(_PERMISSAO);
        this.permissoes.filter(c => c.component === 'Movimentos')[0].listar = this.permissaoService.verificarPermissao(_PERMISSAO);
      });
      this.permissaoService.getPermissoesByFormularioAcaoObjeto('RELATÓRIOS VENDA', 'VISUALIZAR').subscribe((_PERMISSAO: Permissao) => {
        // tslint:disable-next-line:max-line-length
        this.permissoes.filter(c => c.component === 'Relatórios Venda')[0].listar = this.permissaoService.verificarPermissao(_PERMISSAO);
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
    if (this.sidebar === '') {
      this.sidebar = 'sidebar-open';
    } else {
      this.sidebar = '';
    }
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
      this.sidebar = 'sidebar-collapse';
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
