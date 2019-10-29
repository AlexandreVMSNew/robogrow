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

  usuarios: Usuario[];
  usuarioLogado: Usuario;
  textoComentarioAux = '';

  publicacao: Publicacao;

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
    this.getUsuarios();
    if (!this.publicacoes && !this.vendaId) {
      this.carregarPublicacoesUsuarioMarcado();
    }
  }

  carregarPublicacoesUsuarioMarcado() {
    this.publicacoes = [];
    this.publicacaoService.getPublicacoesUsuarioMarcado(this.permissaoService.getUsuarioId())
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

  enviarNotificacoes(usuariosIdNotificacao, publicacao: Publicacao) {
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    const msg = `${this.usuarioLogado.nomeCompleto} adicionou um cadastrar comentário em uma publicação que você foi marcado(a).`;
    const link =  `${location.protocol}//${location.hostname}/publicacoes`;
    const notificacoes: Notificacao[] = [];
    usuariosIdNotificacao.forEach(idUsuario => {
      notificacoes.push(Object.assign({
        id: 0,
        usuarioId: idUsuario,
        dataHora: dataAtual,
        titulo: 'Cadastrar Comentário!',
        mensagem: msg,
        url: link,
        publicacaoId: publicacao.id,
        visto: 0
      }));
    });
    this.notificacaoService.novasNotificacoes(notificacoes).subscribe(
      () => {
      notificacoes.forEach(notificacao => {
        this.socketService.sendSocket('CadastrarComentarioPublicacao', notificacao);
      });
    });
  }

  enviarEmail(usuariosEmailNotificacao, publicacao: Publicacao) {
    const ass = `${this.usuarioLogado.nomeCompleto} adicionou um cadastrar comentário em uma publicação que você foi marcado(a).`;
    const msg = `Para ir até o comentário publicado pelo usuário ${this.usuarioLogado.nomeCompleto} <br/>
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

  notificarUsuariosCadastrarComentario(publicacao: Publicacao) {
    const usuariosIdNotificacao = [];
    const usuariosEmailNotificacao: any = [];


    if (publicacao.compartilharTodos === false) {

      publicacao.publicacaoMarcacoes.forEach((marcacao) => {
        if (marcacao.usuarioId !== this.usuarioLogado.id) {
          usuariosIdNotificacao.push(marcacao.usuarioId);
          usuariosEmailNotificacao.push(this.usuarios.filter(c => c.id === marcacao.usuarioId)[0].email);
        }
      });

    } else if (publicacao.compartilharTodos === true) {

      this.usuarios.forEach((usuario: Usuario) => {
        usuariosIdNotificacao.push(usuario.id);
        usuariosEmailNotificacao.push(usuario.email);
      });

    }

    this.enviarNotificacoes(usuariosIdNotificacao, publicacao);
    this.enviarEmail(usuariosEmailNotificacao,  publicacao);
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
    this.publicacaoService.cadastrarPublicacaoComentario(comentario).subscribe(() => {
      this.notificarUsuariosCadastrarComentario(publicacao);
      publicacao.textoComentario = '';
      this.publicacaoService.atualizarPublicacaoComentarios(publicacao.id);
      this.toastr.success(`Comentário publicado!`);
    }, error => {
      console.log(error.error);
    });
  }

  excluirPublicacao(publicacaoId: number) {
    this.publicacaoService.excluirPublicacao(publicacaoId).subscribe(() => {
      this.toastr.success(`Publicação excluída!`);
      this.publicacaoService.atualizarPublicacoes();
    }, error => {
      console.log(error.error);
    });
  }

  getTemplatePublicacao() {
    return this.publicacaoService.getPublicacaoTemplateStatus();
  }

  abrirTemplatePublicacao(publicacao: Publicacao) {
    this.publicacao = publicacao;
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

  getUsuarios() {
    this.usuarioService.getUsuarios().subscribe(
      (_USUARIOS: Usuario[]) => {
      this.usuarioLogado = _USUARIOS.filter(c => c.id === this.permissaoService.getUsuarioId())[0];
      this.usuarios = _USUARIOS.filter(c => c.id !== this.permissaoService.getUsuarioId());
    }, error => {
      this.toastr.error(`Erro ao tentar carregar usuarios: ${error}`);
    });
  }

}
