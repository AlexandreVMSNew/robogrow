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
import { PublicacaoArquivos } from 'src/app/_models/Publicacoes/PublicacaoArquivos';

@Component({
  selector: 'app-publicacao-template',
  templateUrl: './publicacaoTemplate.component.html',
  styleUrls: ['./publicacaoTemplate.component.css']
})
export class PublicacaoTemplateComponent implements OnInit {

  @Input() vendaId: number;
  @Input() publicacao: Publicacao = null;

  cadastroPublicacao: FormGroup;

  usuarios: Usuario[];
  usuarioLogado: Usuario;
  usuariosMarcados = [];

  templateEnabled = false;

  publicacaoArquivos: PublicacaoArquivos[] = [];
  cadastrarArquivosUpload: File[] = [];
  cadastrarNomeArquivosUpload: any[] = [];
  nomeArquivo = '';

  modoSalvar = '';

  itensCompartilharTodos = [
    {
      label: 'TODOS',
      value: true
    },
    {
      label: 'MARCAR USUÁRIOS ESPECÍFICOS',
      value: false
    }
  ];

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
    this.modoSalvar = 'CADASTRAR';
    if (this.publicacao !== null) {
      this.modoSalvar = 'EDITAR';
      this.cadastroPublicacao.patchValue(this.publicacao);

      this.publicacaoArquivos = this.publicacao.publicacaoArquivos;

      if (this.publicacao.compartilharTodos === false) {
        this.publicacao.publicacaoMarcacoes.forEach(marcacao => {
          this.usuariosMarcados.push(marcacao.usuarioId);
        });
      }
    }
  }

  validarPublicacao() {
    this.cadastroPublicacao = this.fb.group({
      id:  [''],
      texto: ['', Validators.required],
      compartilharTodos: ['', Validators.required],
      usuariosMarcados: [''],
    });
  }

  adicionarArquivoUpload(event) {
    if (event.target.files && event.target.files.length) {
      for (let i = 0; i <= event.target.files.length - 1; i++) {
        this.cadastrarArquivosUpload.push(event.target.files[i]);
        this.publicacaoArquivos.push(Object.assign({
          id: 0,
          arquivoNome: event.target.files[i].name,
          arquivoTamanho: event.target.files[i].size
        }));
        this.cadastrarNomeArquivosUpload.push(event.target.files[i].name);
      }
      console.log(this.publicacaoArquivos);
    }
  }

  excluirArquivoUpload(index) {
    this.publicacaoArquivos.splice(index, 1);
    this.cadastrarArquivosUpload.splice(index, 1);
    this.cadastrarNomeArquivosUpload.splice(index, 1);
    console.log(this.publicacaoArquivos);
  }

  enviarNotificacoes(usuariosIdNotificacao, publicacao: Publicacao) {
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    const msg = `${this.usuarioLogado.nomeCompleto} marcou você em uma nova publicação!`;
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

  enviarEmail(usuariosEmailNotificacao, publicacao: Publicacao) {
    const ass = `${this.usuarioLogado.nomeCompleto} marcou você em uma nova publicação!`;
    const msg = `Para ir até a publicação feita pelo usuário ${this.usuarioLogado.nomeCompleto} <br/>
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

  notificarUsuariosNovaPublicacao(publicacao: Publicacao) {
    const usuariosIdNotificacao = [];
    const usuariosEmailNotificacao: any = [];
    if (publicacao.compartilharTodos === false) {

      publicacao.publicacaoMarcacoes.forEach((marcacao) => {
        usuariosIdNotificacao.push(marcacao.usuarioId);
        usuariosEmailNotificacao.push(this.usuarios.filter(c => c.id === marcacao.usuarioId)[0].email);
      });

    } else if (publicacao.compartilharTodos === true) {

      this.usuarios.forEach((usuario: Usuario) => {
        usuariosIdNotificacao.push(usuario.id);
        usuariosEmailNotificacao.push(usuario.email);
      });

    }

    this.enviarNotificacoes(usuariosIdNotificacao, publicacao);
    this.enviarEmail(usuariosEmailNotificacao, publicacao);
  }

  uploadArquivosPublicacao(template, publicacao) {
    if (this.cadastrarArquivosUpload.length > 0  && this.cadastrarNomeArquivosUpload.length > 0) {
      this.publicacaoService.enviarArquivosPublicacao(publicacao.id, this.cadastrarArquivosUpload, this.cadastrarNomeArquivosUpload)
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

    if ( this.modoSalvar === 'CADASTRAR') {
      this.notificarUsuariosNovaPublicacao(publicacao);
    }
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

    const marcacoes = [];
    if (this.cadastroPublicacao.get('compartilharTodos').value === false) {
      this.usuariosMarcados.forEach((id: number) => {
        marcacoes.push(Object.assign({
          usuarioId: id
        }));
      });
    }

    this.publicacao = Object.assign(this.cadastroPublicacao.value, {
      id: (this.publicacao) ? this.publicacao.id : 0,
      usuarioId: this.permissaoService.getUsuarioId(),
      dataHora: (this.publicacao) ? this.publicacao.dataHora : dataAtual,
      dataHoraAlteracao: dataAtual,
      publicacaoArquivos: this.publicacaoArquivos,
      publicacaoMarcacoes: marcacoes,
    });

    if (this.vendaId) {
      const vendaPublicacao = Object.assign({
        vendaId: this.vendaId,
        publicacoes: this.publicacao
      });
      this.cadastrarVendaPublicacao(template, vendaPublicacao);
    } else {
      if (this.modoSalvar === 'CADASTRAR') {
        this.publicacaoService.novaPublicacao(this.publicacao).subscribe((publicacao: Publicacao) => {
          this.uploadArquivosPublicacao(template, publicacao);
        }, error => {
          console.log(error.error);
        });
      } else if (this.modoSalvar === 'EDITAR') {
        this.publicacaoService.editarPublicacao(this.publicacao).subscribe((publicacao: Publicacao) => {
          this.uploadArquivosPublicacao(template, publicacao);
        }, error => {
          console.log(error.error);
        });
      }
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

  typeOf(value) {
    return typeof value;
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
