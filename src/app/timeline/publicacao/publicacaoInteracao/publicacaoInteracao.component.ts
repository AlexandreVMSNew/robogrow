import { Component, OnInit, Input } from '@angular/core';
import { PublicacaoService } from 'src/app/_services/Publicacoes/publicacao.service';
import { PublicacaoArquivos } from 'src/app/_models/Publicacoes/PublicacaoArquivos';
import { PublicacaoComentario } from 'src/app/_models/Publicacoes/PublicacaoComentario';
import { ToastrService } from 'ngx-toastr';
import { Publicacao } from 'src/app/_models/Publicacoes/Publicacao';
import * as moment from 'moment';
import { EmailService } from 'src/app/_services/Email/email.service';
import { NotificacaoService } from 'src/app/_services/Notificacoes/notificacao.service';
import { SocketService } from 'src/app/_services/WebSocket/Socket.service';
import { Email } from 'src/app/_models/Email/Email';
import { Usuario } from 'src/app/_models/Cadastros/Usuarios/Usuario';
import { UsuarioService } from 'src/app/_services/Cadastros/Usuarios/usuario.service';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { EditarVendaComponent } from 'src/app/movimentos/venda/editarVenda/editarVenda.component';
import { TemplateModalService } from 'src/app/_services/Uteis/TemplateModal/templateModal.service';
import { PublicacaoTemplateComponent } from '../publicacaoTemplate/publicacaoTemplate.component';
import { UsuarioNivel } from 'src/app/_models/Cadastros/Usuarios/UsuarioNivel';
import { FileSaverService } from 'ngx-filesaver';
@Component({
  selector: 'app-publicacao-interacao',
  templateUrl: './publicacaoInteracao.component.html',
  styleUrls: ['./publicacaoInteracao.component.css']
})
export class PublicacaoInteracaoComponent implements OnInit {

  @Input() publicacaoId: number;

  publicacao: Publicacao;

  usuarios: Usuario[];
  usuarioLogado: Usuario;
  usuarioLogadoId: number;
  textoComentarioAux = '';

  templateModalVendaService = new TemplateModalService();
  editarVendaComponent = EditarVendaComponent;

  templateModalPublicacaoTemplateService = new TemplateModalService();
  publicacaoTemplateComponent = PublicacaoTemplateComponent;

  inputs: any;
  componentModal: any;

  constructor(private publicacaoService: PublicacaoService,
              private toastr: ToastrService,
              private emailService: EmailService,
              private notificacaoService: NotificacaoService,
              private socketService: SocketService,
              private usuarioService: UsuarioService,
              private fileSaverService: FileSaverService,
              private permissaoService: PermissaoService) {
   }

  ngOnInit() {
    this.usuarioLogadoId = this.permissaoService.getUsuarioId();
    this.getUsuarios();
    this.carregarPublicacao();
  }

  carregarPublicacao() {
    this.publicacaoService.getPublicacao(this.publicacaoId).subscribe((publicacao: Publicacao) => {
      this.publicacao = publicacao;
    }, error => {
      console.log(error);
    });
  }

  carregarPublicacaoComentarios(publicacaoId: number) {
    this.publicacaoService.getPublicacaoComentarios(publicacaoId).subscribe((publicacaoComentarios: PublicacaoComentario[]) => {
      this.publicacao.publicacaoComentarios = [];
      this.publicacao.publicacaoComentarios = publicacaoComentarios;
    }, error => {
      console.log(error);
    });
  }

  enviarNotificacoes(usuariosIdNotificacao, publicacao: Publicacao, comentario: PublicacaoComentario) {
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    const notificacoes = [];
    let acaoAux = '';

    usuariosIdNotificacao.forEach(idUsuario => {
      if (idUsuario === publicacao.usuarioId) {
        acaoAux = `${this.usuarioLogado.userName} comentou em sua publicação.`;
      } else {
        acaoAux = `${this.usuarioLogado.userName} comentou em uma publicação que você foi marcado.`;
      }
      notificacoes.push(Object.assign({
        id: 0,
        notificanteId: this.usuarioLogadoId,
        notificadoId: idUsuario,
        dataHora: dataAtual,
        tipo: 'PUBLICAÇÃO - NOVO COMENTÁRIO',
        acao: acaoAux,
        toolTip: 'Ir para a publicação.',
        mensagem: comentario.texto,
        componentIdentificacao: `publicacao/${publicacao.id}`,
        icone: 'fa fa-comment',
        toolTipIcone: 'Novo Comentário!',
        corIcone: '#008080',
        visto: 0,
        compartilharTodos: (publicacao.compartilharTodos === true) ? true : false,
      }));
    });
    this.notificacaoService.cadastrarNotificacoes(notificacoes).subscribe(() => {
      notificacoes.forEach((notificacao) => {
        this.socketService.sendSocket('NovoComentarioPublicacao', notificacao);
      });
    });
  }

  enviarEmail(usuariosEmailNotificacao) {
    const ass = `${this.usuarioLogado.nomeCompleto} adicionou um novo comentário em uma publicação que você foi marcado(a).`;
    const msg = `Para ir até o comentário publicado pelo usuário ${this.usuarioLogado.nomeCompleto} <br/>
                <a href="${location.protocol}//${location.hostname}/timeline">CLIQUE AQUI.</a>`;
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

  notificarUsuariosNovoComentario(publicacao: Publicacao, comentario: PublicacaoComentario) {
    const usuariosIdNotificacao = [];
    const usuariosEmailNotificacao: any = [];

    if (this.usuarioLogadoId !== publicacao.usuarioId) {
      usuariosIdNotificacao.push(publicacao.usuarioId);
      usuariosEmailNotificacao.push(this.usuarios.filter(c => c.id === publicacao.usuarioId)[0].email);
    }

    if (publicacao.compartilharTodos === false) {

      if (publicacao.publicacaoUsuarioMarcacoes !== null) {
        publicacao.publicacaoUsuarioMarcacoes.forEach((marcacao) => {
          if (marcacao.usuarioId !== this.usuarioLogadoId) {
            usuariosIdNotificacao.push(marcacao.usuarioId);
            usuariosEmailNotificacao.push(this.usuarios.filter(c => c.id === marcacao.usuarioId)[0].email);
          }
        });

      } else if (publicacao.publicacaoNivelMarcacoes !== null) {
        publicacao.publicacaoNivelMarcacoes.forEach((marcacao) => {
          marcacao.nivel.usuarioNivel.forEach((un: UsuarioNivel) => {
            if (un.userId !== this.usuarioLogadoId) {
              usuariosIdNotificacao.push(un.userId);
              usuariosEmailNotificacao.push(this.usuarios.filter(c => c.id === un.userId)[0].email);
            }
          });
        });
      }

    } else if (publicacao.compartilharTodos === true) {

      this.usuarios.forEach((usuario: Usuario) => {
        usuariosIdNotificacao.push(usuario.id);
        usuariosEmailNotificacao.push(usuario.email);
      });
    }

    this.enviarNotificacoes(usuariosIdNotificacao, publicacao, comentario);
    this.enviarEmail(usuariosEmailNotificacao);
  }

  cadastrarComentario(publicacao: Publicacao) {
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    const usuarioIdComentario = this.permissaoService.getUsuarioId();
    const comentario = Object.assign({
      id: 0,
      publicacaoId: publicacao.id,
      usuarioId: usuarioIdComentario,
      texto: publicacao.textoComentario,
      dataHora: dataAtual,
      dataHoraAlteracao: dataAtual,
    });
    this.publicacaoService.cadastrarPublicacaoComentario(comentario).subscribe((publicacaoComentario: PublicacaoComentario) => {
      this.notificarUsuariosNovoComentario(publicacao, publicacaoComentario);
      publicacao.textoComentario = '';
      this.carregarPublicacaoComentarios(publicacao.id);
      this.notificacaoService.atualizarNotificacoes();
      this.toastr.success(`Comentário publicado!`);
    }, error => {
      console.log(error.error);
    });
  }

  excluirPublicacao(publicacaoId: number) {
    this.publicacaoService.excluirPublicacao(publicacaoId).subscribe(() => {
      this.toastr.success(`Publicação excluída!`);
      this.notificacaoService.atualizarNotificacoes();
    }, error => {
      console.log(error.error);
    });
  }

  downloadArquivo(arquivo: PublicacaoArquivos) {
    this.publicacaoService.downloadArquivoPublicacao(arquivo.publicacaoId, arquivo).subscribe(data => {
      this.fileSaverService.save(data, arquivo.arquivoNome);
    }, error => {
      console.log(error);
    });
  }

  getUrlUsuarioLogadoFotoPerfil(): string {
    return this.permissaoService.getUrlUsuarioLogadoFotoPerfil();
  }

  getUrlUsuarioFotoPerfil(usuarioId, nomeArquivoFotoPerfil) {
    return this.usuarioService.getUrlUsuarioFotoPerfil(usuarioId, nomeArquivoFotoPerfil);
  }

  get textoComentario(): string {
    return this.textoComentarioAux;
  }

  set textoComentario(value: string) {
    this.textoComentarioAux = value;
  }

  getTemplateModalPublicacaoTemplate() {
    return this.templateModalPublicacaoTemplateService.getTemplateModalStatus();
  }

  abrirTemplateModalPublicacaoTemplate(publicacaoInput: Publicacao) {
    this.componentModal = PublicacaoTemplateComponent;
    this.inputs = Object.assign({
      publicacao: publicacaoInput,
    });
    this.templateModalPublicacaoTemplateService.setTemplateModalStatus(true);
  }

  abrirTemplateVendaModal( vendaId: number) {
    this.componentModal = EditarVendaComponent;
    this.inputs = Object.assign({idVenda: vendaId});
    this.templateModalVendaService.setTemplateModalStatus(true);
  }

  getTemplateModalVenda() {
    return this.templateModalVendaService.getTemplateModalStatus();
  }

  getUsuarios() {
    this.usuarioService.getUsuarios().subscribe(
      (_USUARIOS: Usuario[]) => {
      this.usuarioLogado = _USUARIOS.filter(c => c.id === this.usuarioLogadoId)[0];
      this.usuarios = _USUARIOS.filter(c => c.id !== this.permissaoService.getUsuarioId());
    }, error => {
      this.toastr.error(`Erro ao tentar carregar usuarios: ${error}`);
    });
  }

}
