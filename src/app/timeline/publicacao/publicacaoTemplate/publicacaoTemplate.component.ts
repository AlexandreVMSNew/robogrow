import { Component, OnInit, Input } from '@angular/core';
import { PublicacaoService } from 'src/app/_services/Publicacoes/publicacao.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Publicacao } from 'src/app/_models/Publicacoes/Publicacao';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { DataService } from 'src/app/_services/Cadastros/Uteis/data.service';
import { VendaService } from 'src/app/_services/Movimentos/Venda/venda.service';
import { VendaPublicacao } from 'src/app/_models/Movimentos/Venda/VendaPublicacao';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { Usuario } from 'src/app/_models/Cadastros/Usuarios/Usuario';
import { UsuarioService } from 'src/app/_services/Cadastros/Usuarios/usuario.service';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { SocketService } from 'src/app/_services/WebSocket/Socket.service';
import { Email } from 'src/app/_models/Email/Email';
import { Notificacao } from 'src/app/_models/Notificacoes/notificacao';
import { NotificacaoService } from 'src/app/_services/Notificacoes/notificacao.service';
import { EmailService } from 'src/app/_services/Email/email.service';

@Component({
  selector: 'app-publicacao-template',
  templateUrl: './publicacaoTemplate.component.html',
  styleUrls: ['./publicacaoTemplate.component.css']
})
export class PublicacaoTemplateComponent implements OnInit {

  @Input() vendaId: number;

  cadastroPublicacao: FormGroup;
  @Input() publicacao: Publicacao;

  usuarios: Usuario[];
  usuariosMarcados = [];

  templateEnabled = false;

  arquivosUpload: File[] = [];
  nomeArquivosUpload: any[] = [];
  nomeArquivo = '';

  constructor(private publicacaoService: PublicacaoService,
              private fb: FormBuilder,
              private toastr: ToastrService,
              private usuarioService: UsuarioService,
              private vendaService: VendaService,
              private permissaoService: PermissaoService,
              private socketService: SocketService,
              private notificacaoService: NotificacaoService,
              private emailService: EmailService
              ) { }

  ngOnInit() {
    this.getUsuarios();
    this.validarPublicacao();
  }

  validarPublicacao() {
    this.cadastroPublicacao = this.fb.group({
      id:  [''],
      texto: ['', Validators.required],
      usuariosMarcados: [''],
    });
  }

  adicionarArquivoUpload(event) {
    if (event.target.files && event.target.files.length) {
      for (let i = 0; i <= event.target.files.length - 1; i++) {
        this.arquivosUpload.push(event.target.files[i]);
        this.nomeArquivosUpload.push(event.target.files[i].name);
      }
    }
  }

  excluirArquivoUpload(index) {
    this.nomeArquivosUpload.splice(index, 1);
    this.arquivosUpload.splice(index, 1);
  }

  enviarNotificacoes(usuariosIdNotificacao, usuarioComentario: Usuario, publicacao: Publicacao) {
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    const msg = `${usuarioComentario.nomeCompleto} marcou você em uma nova publicação!`;
    const link =  `${location.protocol}//${location.hostname}/publicacoes/${publicacao.id}`;
    const notificacoes: Notificacao[] = [];
    usuariosIdNotificacao.forEach(idUsuario => {
      notificacoes.push(Object.assign({
        id: 0,
        usuarioId: idUsuario,
        dataHora: dataAtual,
        titulo: 'Nova Publicação!',
        mensagem: msg,
        url: link,
        visto: 0
      }));
    });
    this.notificacaoService.novasNotificacoes(notificacoes).subscribe(
      () => {
      notificacoes.forEach(notificacao => {
        this.socketService.sendSocket('NovaPublicacao', notificacao);
      });
    });
  }

  enviarEmail(usuariosEmailNotificacao, usuarioComentario: Usuario, publicacao: Publicacao) {
    const ass = `${usuarioComentario.nomeCompleto} marcou você em uma nova publicação!`;
    const msg = `Para ir até a publicação feita pelo usuário ${usuarioComentario.nomeCompleto} <br/>
                <a href="${location.protocol}//${location.hostname}/publicacoes/${publicacao.id}">CLIQUE AQUI.</a>`;
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

  notificarUsuariosNovaPublicacao(publicacao: Publicacao, usuarioIdPublicacao: number) {
    const usuariosIdNotificacao = [];
    const usuariosEmailNotificacao: any = [];
    this.usuarioService.getUsuarios().subscribe(
      (_USUARIOS: Usuario[]) => {
        const usuarioPublicacao = _USUARIOS.filter(c => c.id === usuarioIdPublicacao)[0];
        publicacao.publicacaoMarcacoes.forEach((marcacao) => {
          usuariosIdNotificacao.push(marcacao.usuarioId);
          usuariosEmailNotificacao.push(_USUARIOS.filter(c => c.id === marcacao.usuarioId)[0].email);
        });
        this.enviarNotificacoes(usuariosIdNotificacao, usuarioPublicacao, publicacao);
        this.enviarEmail(usuariosEmailNotificacao, usuarioPublicacao, publicacao);
    });
  }

  uploadArquivosPublicacao(template, publicacao) {
    if (this.arquivosUpload.length > 0  && this.nomeArquivosUpload.length) {
      this.publicacaoService.enviarArquivosPublicacao(publicacao.id, this.arquivosUpload, this.nomeArquivosUpload)
      .subscribe((result: any) => {
        if (result.retorno === 'OK') {
          this.toastr.success(`Upload realizado com Sucesso!`);
        }
      }, error => {
        this.toastr.error(`Erro no Upload do(s) arquivo(s)!`);
        console.log(error.error);
      });
    }
    if (this.vendaId) {
      this.vendaService.atualizarPublicacoesVenda();
    } else {
      this.publicacaoService.atualizarPublicacoes();
    }
    this.notificarUsuariosNovaPublicacao(publicacao, publicacao.usuarioId);
    this.fecharTemplate(template);
    this.toastr.success(`Publicado com Sucesso!`);
  }

  cadastrarVendaPublicacao(template, vendaPublicacao) {
    this.vendaService.novaVendaPublicacao(vendaPublicacao).subscribe((publicacao: Publicacao) => {
      this.uploadArquivosPublicacao(template, publicacao);
    }, error => {
      console.log(error.error);
    });
  }

  cadastrarPublicacao(template: any) {
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    const arquivos = [];

    this.arquivosUpload.forEach((arquivo: File) => {
      arquivos.push(Object.assign({
        id: 0,
        arquivoNome: arquivo.name,
        arquivoTamanho: arquivo.size
      }));
    });

    const marcacoes = [];
    this.usuariosMarcados.forEach((id: number) => {
      marcacoes.push(Object.assign({
        usuarioId: id
      }));
    });

    this.publicacao = Object.assign(this.cadastroPublicacao.value, {
      id: 0,
      usuarioId: this.permissaoService.getUsuarioId(),
      dataHora: dataAtual,
      dataHoraAlteracao: dataAtual,
      publicacaoArquivos: arquivos,
      publicacaoMarcacoes: marcacoes,
    });

    if (this.vendaId) {
      const vendaPublicacao = Object.assign({
        vendaId: this.vendaId,
        publicacoes: this.publicacao
      });
      this.cadastrarVendaPublicacao(template, vendaPublicacao);
    } else {
      this.publicacaoService.novaPublicacao(this.publicacao).subscribe((publicacao: Publicacao) => {
        this.uploadArquivosPublicacao(template, publicacao);
      }, error => {
        console.log(error.error);
      });
    }
  }

  marcarTodos() {
    this.usuariosMarcados = this.usuarios.map(c => c.id);
  }

  desmarcarTodos() {
    this.usuariosMarcados = [];
  }

  abrirTemplate(template: any) {
    if (this.templateEnabled === false) {
      template.show();
      this.templateEnabled = true;
    }
  }

  fecharTemplate(template: any) {
    template.hide();
    this.publicacaoService.setPublicacaoTemplateStatus(false);
    this.templateEnabled = false;
  }

  getUrlUsuarioFotoPerfil(usuarioId, nomeArquivoFotoPerfil) {
    return this.usuarioService.getUrlUsuarioFotoPerfil(usuarioId, nomeArquivoFotoPerfil);
  }

  getUsuarios() {
    this.usuarioService.getUsuarios().subscribe(
      (_USUARIOS: Usuario[]) => {
      this.usuarios = _USUARIOS;
    }, error => {
      this.toastr.error(`Erro ao tentar carregar usuarios: ${error}`);
    });
  }

}
