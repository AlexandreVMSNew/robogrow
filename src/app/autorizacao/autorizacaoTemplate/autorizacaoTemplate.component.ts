import { Component, OnInit, ChangeDetectorRef, ViewChild, Input, AfterViewChecked, AfterViewInit } from '@angular/core';
import { Autorizacao } from 'src/app/_models/Autorizacoes/Autorizacao';
import { Permissao } from 'src/app/_models/Permissoes/permissao';
import { AutorizacaoService } from 'src/app/_services/Autorizacoes/autorizacao.service';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/_services/Cadastros/Uteis/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/_models/Cadastros/Usuarios/Usuario';
import { UsuarioService } from 'src/app/_services/Cadastros/Usuarios/usuario.service';
import * as moment from 'moment';
import { Notificacao } from 'src/app/_models/Notificacoes/notificacao';
import { NotificacaoService } from 'src/app/_services/Notificacoes/notificacao.service';
import { SocketService } from 'src/app/_services/WebSocket/Socket.service';
import { Email } from 'src/app/_models/Email/Email';
import { EmailService } from 'src/app/_services/Email/email.service';
import { PermissaoAcoes } from 'src/app/_models/Permissoes/permissaoAcoes';
import { TemplateModalService } from 'src/app/_services/Uteis/TemplateModal/templateModal.service';
@Component({
  selector: 'app-autorizacao-template',
  templateUrl: './autorizacaoTemplate.component.html',
  styleUrls: ['./autorizacaoTemplate.component.css']
})
export class AutorizacaoTemplateComponent implements OnInit, AfterViewChecked {

  @Input() idAutorizacao: number;
  @ViewChild('templateAutorizacao') templateAutorizacao: any;

  formularioComponent = 'AUTORIZAÇÕES';
  editar = false;

  cadastroAutorizacao: FormGroup;
  autorizacao: Autorizacao;

  autorizado = ['NÃO', 'SIM'];
  autorizadoSelecionado: string;

  usuarios: Usuario[];

  templateEnabled = false;

  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              public dataService: DataService,
              private permissaoService: PermissaoService,
              private usuarioService: UsuarioService,
              private changeDetectionRef: ChangeDetectorRef,
              private autorizacaoService: AutorizacaoService,
              private notificacaoService: NotificacaoService,
              private emailService: EmailService,
              private socketService: SocketService) {
              }

  ngOnInit() {
    this.getUsuarios();
    this.validarAutorizacao();
    if (this.idAutorizacao !== 0) {
      this.carregarAutorizacao();
    }
  }

  configurarPermissao(objetoAutorizacao) {
    const usuarioNiveisLogado = this.permissaoService.getUsuarioNiveis();
    this.permissaoService.getPermissaoAcoesByFormularioAndObjeto(
      Object.assign({formulario: 'AUTORIZAÇÕES', permissaoObjetos: [{objeto: objetoAutorizacao}]}))
      .subscribe((_ACOES: PermissaoAcoes[]) => {
      _ACOES.forEach((acao) => {
        if (acao.editar === true && usuarioNiveisLogado.indexOf(acao.nivelId.toString(), 0) > -1) {
          this.editar = true;
          console.log(true);
        }
      });
    });
  }

  ngAfterViewChecked() {
    this.changeDetectionRef.detectChanges();
  }

  carregarAutorizacao() {
    this.autorizacao = null;
    this.autorizacaoService.getAutorizacaoById(this.idAutorizacao)
    .subscribe(
    (_AUTORIZACAO: Autorizacao) => {
      this.autorizacao = Object.assign(_AUTORIZACAO);

      let autorizado = '';
      if (this.autorizacao.autorizado === 0 && this.autorizacao.autorizador) {
        autorizado = 'NÃO';
      } else if (this.autorizacao.autorizado === 1 && this.autorizacao.autorizador) {
        autorizado = 'SIM';
      }

      this.cadastroAutorizacao.patchValue(this.autorizacao);
      this.cadastroAutorizacao.controls.autorizado.setValue(autorizado);
      this.configurarPermissao(this.autorizacao.objeto);
    }, error => {
      this.toastr.error(`Erro ao tentar carregar Autorizacao: ${error.error}`);
      console.log(error);
    });
  }

  validarAutorizacao() {
    this.cadastroAutorizacao = this.fb.group({
      id:  [''],
      solicitanteId: [''],
      autorizadorId: [''],
      formularioId: [''],
      formularioIdentificacao: [''],
      formulario: [''],
      acao: [''],
      objeto: [''],
      observacoes: [''],
      dataHoraSolicitado: [''],
      dataHoraAutorizado: [''],
      autorizado: ['', Validators.required],
      visto: [0]
    });
  }

  salvarAutorizacao(template: any) {
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    const autorizadoValor = (this.autorizadoSelecionado === 'SIM') ? 1 : 0;
    this.autorizacao = Object.assign(this.cadastroAutorizacao.value, {
      autorizadorId: this.permissaoService.getUsuarioId(),
      dataHoraAutorizado: dataAtual,
      autorizado: autorizadoValor,
    });

    this.autorizacaoService.editarAutorizacao(this.autorizacao).subscribe(
      () => {
        const idSolicitante = this.cadastroAutorizacao.get('solicitanteId').value;
        const emailSolicitante: any = [this.usuarios.filter(c => c.id === idSolicitante)[0].email];
        const nomeAutorizador = this.permissaoService.getUsuario();
        const msg = `Sua solicitação para ${this.autorizacao.acao}
         ${(this.autorizacao.objeto) ? this.autorizacao.objeto : ''} em ${this.autorizacao.formulario}
        (${this.autorizacao.formularioIdentificacao})
        foi ${(autorizadoValor === 1) ? 'AUTORIZADO' : 'NEGADO'}.`;
        const notificacao = Object.assign({
          id: 0,
          usuarioId: idSolicitante,
          dataHora: dataAtual,
          titulo: 'Resposta Autorização',
          mensagem: msg,
          visto: 0
        });

        const email: Email = {
          emailRemetente: 'virtualwebsistema@gmail.com',
          nomeRemetente: 'Virtual Web',
          senhaRemetente: '1379258vms//',
          emailDestinatario: emailSolicitante,
          assunto: `Resposta Autorização ${this.autorizacao.acao} ${(this.autorizacao.objeto) ? this.autorizacao.objeto : ''}`,
          mensagem: `Sua solicitação para ${this.autorizacao.acao}
                    ${(this.autorizacao.objeto) ? this.autorizacao.objeto : ''} em ${this.autorizacao.formulario}
                    (${this.autorizacao.formularioIdentificacao})
         foi ${(autorizadoValor === 1) ? 'AUTORIZADO' : 'NEGADO'}.\n
         <a href="https://virtualweb.herokuapp.com/movimentos/vendas/editar/${this.autorizacao.formularioId}">
         CLIQUE AQUI PARA ABRIR A VENDA!</a>`,
        };
        this.emailService.enviarEmail(email).subscribe((_RESPOSTA) => {
        }, error => {
          console.log(error.error);
        });
        this.notificacaoService.novaNotificacao(notificacao).subscribe(
          () => {
          this.socketService.sendSocket('RespAutorizacaoVendaGerarPedido', notificacao);
        });
        this.autorizacaoService.atualizarAutorizacoes();
        this.toastr.success(`Editado com Sucesso!`);
      }, error => {
        console.log(error.error);
      }
    );
  }

  getUsuarios() {
    this.usuarioService.getUsuarios().subscribe(
      (_USUAIROS: Usuario[]) => {
      this.usuarios = _USUAIROS;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar usuarios: ${error.error}`);
    });
  }


}
