import { Component, OnInit, AfterViewInit } from '@angular/core';
import { IdeiaService } from './_services/Cadastros/Ideias/ideia.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  visualizarPermissao = false;
  listarVenda = false;
  listarProduto = false;
  listarPessoa = false;
  listarCliente = false;

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

  Nav: any =
  [
    [
      {
        nome: 'DashBoard',
        active: ''
      }
    ],
    [
      {
        nome: 'Cadastros',
        active: '',
        menuOpen: 'menu-open',
        subNav:
        [
          [
            {
              nome: 'Usuários',
              active: ''
            }
          ],
          [
            {
              nome: 'Clientes',
              active: ''
            }
          ]
        ]
      }
    ],
    [
      {
        nome: 'Atendimentos',
        active: '',
        menuOpen: '',
        subNav:
        [
          {
            nome: 'Retornos',
            active: ''
          }
        ]
      }
    ]
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
              public dataService: DataService) {
    this.localeService.use('pt-br');
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

  ngAfterViewInit() {
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('PERMISSOES', 'VISUALIZAR').subscribe((_PERMISSAO: Permissao) => {
      this.visualizarPermissao = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('PESSOAS', 'LISTAR').subscribe((_PERMISSAO: Permissao) => {
      this.listarPessoa = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('CLIENTES', 'LISTAR').subscribe((_PERMISSAO: Permissao) => {
      this.listarCliente = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('PRODUTOS', 'LISTAR').subscribe((_PERMISSAO: Permissao) => {
      this.listarProduto = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('VENDA', 'LISTAR').subscribe((_PERMISSAO: Permissao) => {
      this.listarVenda = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
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
