import { Component, OnInit, Input } from '@angular/core';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { PublicacaoService } from 'src/app/_services/Publicacoes/publicacao.service';
import { Publicacao } from 'src/app/_models/Publicacoes/Publicacao';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { UsuarioService } from 'src/app/_services/Cadastros/Usuarios/usuario.service';
import { PublicacaoMarcacoes } from 'src/app/_models/Publicacoes/PublicacaoMarcacoes';
import { PublicacaoComentario } from 'src/app/_models/Publicacoes/PublicacaoComentario';
import { Usuario } from 'src/app/_models/Cadastros/Usuarios/Usuario';
import { PublicacaoArquivos } from 'src/app/_models/Publicacoes/PublicacaoArquivos';
import * as moment from 'moment';
import { EmailService } from 'src/app/_services/Email/email.service';
import { NotificacaoService } from 'src/app/_services/Notificacoes/notificacao.service';
import { SocketService } from 'src/app/_services/WebSocket/Socket.service';
import { ToastrService } from 'ngx-toastr';
import { Email } from 'src/app/_models/Email/Email';
import { Notificacao } from 'src/app/_models/Notificacoes/notificacao';

@Component({
  selector: 'app-publicacao',
  templateUrl: './publicacao.component.html',
  styleUrls: ['./publicacao.component.css']
})
export class PublicacaoComponent implements OnInit {
  @Input() vendaId: number;
  @Input() publicacoes: Publicacao[];

  usuarioLogadoId: number;
  textoComentarioAux = '';

  constructor(private publicacaoService: PublicacaoService,
              private permissaoService: PermissaoService,
              private usuarioService: UsuarioService,
              private emailService: EmailService,
              private notificacaoService: NotificacaoService,
              private socketService: SocketService,
              private toastr: ToastrService
              ) {
                this.publicacaoService.atualizaPublicacoes.subscribe(x => {
                    this.carregarPublicacoesUsuarioMarcado();
                });
                this.publicacaoService.atualizaPublicacaoComentarios.subscribe((publicacaoId: number) => {
                  this.carregarPublicacaoComentarios(publicacaoId);
                });

              }

  ngOnInit() {
    this.usuarioLogadoId = this.permissaoService.getUsuarioId();
    if (!this.publicacoes && !this.vendaId) {
      this.carregarPublicacoesUsuarioMarcado();
    }
  }

  carregarPublicacoesUsuarioMarcado() {
    this.publicacoes = [];
    this.publicacaoService.getPublicacoesUsuarioMarcado(this.usuarioLogadoId)
    .subscribe((publicacoes: Publicacao[]) => {
      this.publicacoes = publicacoes;
    }, error => {
      console.log(error);
    });
  }

  carregarPublicacaoComentarios(publicacaoId: number) {
    this.publicacaoService.getPublicacaoComentarios(publicacaoId).subscribe((publicacaoComentarios: PublicacaoComentario[]) => {
      this.publicacoes.filter(c => c.id === publicacaoId)[0].publicacaoComentarios = [];
      this.publicacoes.filter(c => c.id === publicacaoId)[0].publicacaoComentarios = publicacaoComentarios;
    }, error => {
      console.log(error);
    });
  }

  enviarNotificacoes(usuariosIdNotificacao, usuarioComentario: Usuario, publicacao: Publicacao) {
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    const msg = `${usuarioComentario.nomeCompleto} adicionou um novo comentário em uma publicação que você foi marcado(a).`;
    const link =  `${location.protocol}//${location.hostname}/publicacoes`;
    const notificacoes: Notificacao[] = [];
    usuariosIdNotificacao.forEach(idUsuario => {
      notificacoes.push(Object.assign({
        id: 0,
        usuarioId: idUsuario,
        dataHora: dataAtual,
        titulo: 'Novo Comentário!',
        mensagem: msg,
        url: link,
        publicacaoId: publicacao.id,
        visto: 0
      }));
    });
    this.notificacaoService.novasNotificacoes(notificacoes).subscribe(
      () => {
      notificacoes.forEach(notificacao => {
        this.socketService.sendSocket('NovoComentarioPublicacao', notificacao);
      });
    });
  }

  enviarEmail(usuariosEmailNotificacao, usuarioComentario: Usuario, publicacao: Publicacao) {
    const ass = `${usuarioComentario.nomeCompleto} adicionou um novo comentário em uma publicação que você foi marcado(a).`;
    const msg = `Para ir até o comentário publicado pelo usuário ${usuarioComentario.nomeCompleto} <br/>
                <a href="${location.protocol}//${location.hostname}/publicacoes">CLIQUE AQUI.</a>`;
    const email: Email = {
      emailRemetente: 'virtualwebsistema@gmail.com',
      nomeRemetente: 'Virtual Web',
      senhaRemetente: '1379258vms//',
      emailDestinatario: usuariosEmailNotificacao,
      assunto: ass,
      mensagem: msg
    };
    this.emailService.enviarEmail(email).subscribe((_RESPOSTA) => {
    }, error => {
      console.log(error.error);
    });
  }

  notificarUsuariosNovoComentario(publicacao: Publicacao, usuarioIdComentario: number) {
    const usuariosIdNotificacao = [];
    const usuariosEmailNotificacao: any = [];
    this.usuarioService.getUsuarios().subscribe(
      (_USUARIOS: Usuario[]) => {
        const usuarioComentario = _USUARIOS.filter(c => c.id === usuarioIdComentario)[0];

        if (publicacao.usuarioId !== usuarioIdComentario) {
          usuariosIdNotificacao.push(publicacao.usuarioId);
          usuariosEmailNotificacao.push(_USUARIOS.filter(c => c.id === publicacao.usuarioId)[0].email);
        }

        publicacao.publicacaoMarcacoes.forEach((marcacao) => {
          if (marcacao.usuarioId !== usuarioIdComentario) {
            usuariosIdNotificacao.push(marcacao.usuarioId);
            usuariosEmailNotificacao.push(_USUARIOS.filter(c => c.id === marcacao.usuarioId)[0].email);
          }
        });

        this.enviarNotificacoes(usuariosIdNotificacao, usuarioComentario, publicacao);
        this.enviarEmail(usuariosEmailNotificacao, usuarioComentario, publicacao);
    });
  }

  cadastrarComentario(publicacao: Publicacao) {
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    const usuarioIdComentario = this.permissaoService.getUsuarioId();
    const comentario = Object.assign({
      id: 0,
      publicacoesId: publicacao.id,
      usuarioId: usuarioIdComentario,
      texto: publicacao.textoComentario,
      dataHora: dataAtual,
      dataHoraAlteracao: dataAtual,
    });
    this.publicacaoService.novoPublicacaoComentario(comentario).subscribe(() => {
      this.notificarUsuariosNovoComentario(publicacao, usuarioIdComentario);
      publicacao.textoComentario = '';
      this.publicacaoService.atualizarPublicacaoComentarios(publicacao.id);
      this.toastr.success(`Comentário publicado!`);
    }, error => {
      console.log(error.error);
    });
  }

  getTemplatePublicacao() {
    return this.publicacaoService.getPublicacaoTemplateStatus();
  }

  abrirTemplatePublicacao() {
    this.publicacaoService.setPublicacaoTemplateStatus(true);
  }

  getUrlUsuarioLogadoFotoPerfil(): string {
    return this.permissaoService.getUrlUsuarioLogadoFotoPerfil();
  }

  getUrlUsuarioFotoPerfil(usuarioId, nomeArquivoFotoPerfil) {
    return this.usuarioService.getUrlUsuarioFotoPerfil(usuarioId, nomeArquivoFotoPerfil);
  }

  downloadArquivo(arquivo: PublicacaoArquivos) {
    this.publicacaoService.downloadArquivoPublicacao(arquivo.publicacoesId, arquivo).subscribe(data => {
      saveAs(data, arquivo.arquivoNome);
    }, error => {
      console.log(error);
    });
  }

  get textoComentario(): string {
    return this.textoComentarioAux;
  }

  set textoComentario(value: string) {
    this.textoComentarioAux = value;
  }

}
