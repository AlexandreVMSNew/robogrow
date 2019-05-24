import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../_services/Cadastros/Login/auth.service';
import { Router } from '@angular/router';
import { InfoUsuario } from '../_models/Info/infoUsuario';
import { NotificacaoService } from '../_services/Notificacoes/notificacao.service';
import { Notificacao } from '../_models/Notificacoes/notificacao';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  notificacoes: Notificacao[];
  qtdNotificacoes: number;

  private updateSubscription: Subscription;

  constructor(private toastr: ToastrService,
              public authService: AuthService,
              private notificacaoService: NotificacaoService,
              private router: Router) { }

  ngOnInit() {
    if (!('Notification' in window)) {
      alert('This browser does not support system notifications');
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission();
    }

    this.updateSubscription = interval(30000).subscribe(
      async (val) => {
        if (this.loggedIn()) {
          this.notificacaoService.getCountNotificacoesByUsuarioId(InfoUsuario.id).subscribe(
            (_COUNT: number) => {
              if (this.qtdNotificacoes !== _COUNT && _COUNT > 0) {

                this.qtdNotificacoes = _COUNT;
                this.getNotificacoes();

                const  notification = new Notification(`Olá, ${InfoUsuario.usuario} !`, {
                  body: 'Você tem nova(s) Notificação(ões)!'
                });

              }
          });
        }
      });
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    this.updateSubscription.unsubscribe();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    if (this.loggedIn()) {
     this.getNotificacoes();
    }
  }

  loggedIn() {
    return this.authService.loggerIn();
  }

  logout() {
    localStorage.removeItem('token');
    this.toastr.show('Log Out.');
    this.router.navigate(['/usuarios/login']);
  }

  usuarioNome() {
    return InfoUsuario.usuario;
  }

  usuarioId() {
    return InfoUsuario.id;
  }

  getQtdNotificacoes() {
    if (this.notificacoes) {
      return this.notificacoes.filter(c => c.visto === 0).length;
    } else {
      return 0;
    }
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
    this.notificacaoService.getAllNotificacoesByUsuarioId(this.usuarioId()).subscribe(
      (_NOTIFICACOES: Notificacao[]) => {
      this.notificacoes = _NOTIFICACOES;
      this.qtdNotificacoes = _NOTIFICACOES.length;
    }, error => {
      this.toastr.error(`Erro ao tentar carregar notificacoes: ${error}`);
    });
}
}
