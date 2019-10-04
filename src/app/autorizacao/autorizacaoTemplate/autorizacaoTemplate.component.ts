import { Component, OnInit, ChangeDetectorRef, ViewChild, Input, AfterViewChecked } from '@angular/core';
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
@Component({
  selector: 'app-autorizacao-template',
  templateUrl: './autorizacaoTemplate.component.html',
  styleUrls: ['./autorizacaoTemplate.component.css']
})
export class AutorizacaoTemplateComponent implements OnInit, AfterViewChecked {

  @Input() idAutorizacao: number;
  @Input() formulario: string;
  @Input() acao: string;
  @Input() objeto: string;
  @ViewChild('templateAutorizacao') templateAutorizacao: any;

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
              private socketService: SocketService) {
              }

  ngOnInit() {
    this.getUsuarios();
    this.validarAutorizacao();
    if (this.idAutorizacao !== 0) {
      this.carregarAutorizacao();
    }
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
      this.permissaoService.getPermissoesByFormularioAcaoObjeto(
        Object.assign({formulario: 'AUTORIZACOES', acao: this.autorizacao.acao})).subscribe(
        (_PERMISSAO: Permissao) => {
        this.editar = this.permissaoService.verificarPermissao(_PERMISSAO);
      });
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
        const info = {
          autorizadorNome: nomeAutorizador,
          solicitanteId: idSolicitante,
          autorizado: autorizadoValor
        };
        this.notificacaoService.novaNotificacao(notificacao).subscribe(
          () => {
          this.socketService.sendSocket('RespAutorizacaoVendaGerarPedido', info);
        });
        this.autorizacaoService.atualizarAutorizacoes();
        this.toastr.success(`Editado com Sucesso!`);
        this.fecharTemplate(this.templateAutorizacao);
      }, error => {
        console.log(error.error);
      }
    );
  }

  abrirTemplate(template: any) {
    if (this.templateEnabled === false) {
      template.show();
      this.templateEnabled = true;
    }
  }

  fecharTemplate(template: any) {
    template.hide();
    this.autorizacaoService.setAutorizacaoTemplateStatus(false);
    this.templateEnabled = false;
  }

  getUsuarios() {
    this.usuarioService.getAllUsuario().subscribe(
      (_USUAIROS: Usuario[]) => {
      this.usuarios = _USUAIROS;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar usuarios: ${error.error}`);
    });
  }


}
