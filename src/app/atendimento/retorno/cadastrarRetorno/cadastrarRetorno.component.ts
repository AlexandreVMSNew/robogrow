import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/_models/Cadastros/Clientes/Cliente';
import { ClienteService } from 'src/app/_services/Cadastros/Clientes/cliente.service';
import { Retorno } from 'src/app/_models/Atendimentos/Retornos/retorno';
import { RetornoService } from 'src/app/_services/Atendimentos/Retornos/retorno.service';
import * as moment from 'moment';
import { Usuario } from 'src/app/_models/Cadastros/Usuarios/Usuario';
import { UsuarioService } from 'src/app/_services/Cadastros/Usuarios/usuario.service';
import { NotificacaoService } from 'src/app/_services/Notificacoes/notificacao.service';
import { Notificacao } from 'src/app/_models/Notificacoes/notificacao';
import { RetornoObservacao } from 'src/app/_models/Atendimentos/Retornos/retornoObservacao';
import { SocketService } from 'src/app/_services/WebSocket/Socket.service';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { SpinnerService } from 'src/app/_services/Uteis/Spinner/spinner.service';

@Component({
  selector: 'app-cadastrar-retorno',
  templateUrl: './cadastrarRetorno.component.html'

})
export class CadastrarRetornoComponent implements OnInit {

  cadastroForm: FormGroup;
  retorno: Retorno;
  retornoObservacao: RetornoObservacao;
  observacaoTextAux = '';

  prioridades = ['NORMAL', 'URGENTE'];
  prioridadeSelecionado = 'NORMAL';

  cliente: Cliente;
  clientes: Cliente[];
  clienteIdSelecionado: any;

  usuarios: Usuario[];
  usuarioIdSelecionado: any;

  valueTelefonePipe = '';

  dataHoraAtual = new Date();

  usuarioLogadoId: number;
  usuarioLogado: Usuario;

  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private spinnerService: SpinnerService,
              private clienteService: ClienteService,
              private usuarioService: UsuarioService,
              private retornoService: RetornoService,
              private notificacaoService: NotificacaoService,
              private router: Router,
              private socketService: SocketService,
              public permissaoService: PermissaoService) {
                moment.locale('pt-BR');
               }

  ngOnInit() {
    this.usuarioLogadoId = this.permissaoService.getUsuarioId();
    this.getClientes();
    this.getUsuarios();
    this.validarForm();
  }

  get observacaoTexto(): string {
    return this.observacaoTextAux;
  }

  set observacaoTexto(value: string) {
    this.observacaoTextAux = value;
  }

  validarForm() {
    this.cadastroForm = this.fb.group({
        id:  [''],
        clienteId: ['', Validators.required],
        contatoNome: ['', Validators.required],
        telefone: ['', Validators.required],
        prioridade: ['', Validators.required],
        usuarioId: ['', Validators.required],
        dataHora: [''],
        status: [''],
        observacao: ['']
    });
  }

  cadastrarRetorno() {
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    if (this.cadastroForm.valid) {
      this.retorno = Object.assign(this.cadastroForm.value, {id: 0, status: 'AGUARDANDO', dataHora: dataAtual});
      this.spinnerService.alterarSpinnerStatus(true);
      this.retornoService.cadastrarRetorno(this.retorno).subscribe(
        () => {

          this.retornoService.getIdUltimoRetorno().subscribe((ultimoId: number) => {
            if (this.observacaoTextAux !== '') {
              this.retornoObservacao = Object.assign({id: 0, retornoId: ultimoId,
              usuarioId: this.usuarioLogadoId, dataHora: dataAtual, observacao: this.observacaoTextAux});
              this.retornoService.novaObservacao(this.retornoObservacao).subscribe();
            }

            const retornoLog = Object.assign({ id: 0, retornoId: ultimoId,
              usuarioId: this.usuarioLogadoId, dataHora: dataAtual, status: 'AGUARDANDO'});

            this.retornoService.cadastrarLog(retornoLog).subscribe(
              () => {
                this.toastr.success(`Retorno Finalizado!`);
                this.socketService.sendSocket('StatusRetornoAlterado', null);
              }, error => {
                this.toastr.error(`Erro ao tentar criar log: ${error.error}`);
                console.log(error.error);
              });
          });

          if (this.retorno.usuarioId !== 0) {
            const notificacao = Object.assign({
              id: 0,
              notificanteId: this.usuarioLogadoId,
              notificadoId: this.retorno.usuarioId ,
              dataHora: dataAtual,
              tipo: 'NOVO RETORNO ESPECÍFICO',
              acao: `${this.usuarioLogado.userName} cadastrou um novo retorno específico para você.`,
              toolTip: 'Ir para o Retorno.',
              componentIdentificacao: `retorno/${this.retorno.id}`,
              icone: 'fa fa-phone',
              toolTipIcone: 'Novo Retorno Específico!',
              corIcone: '#B22222',
              compartilharTodos: false,
              visto: 0,
            });

            this.notificacaoService.cadastrarNotificacao(notificacao).subscribe(() => {
              this.socketService.sendSocket('NovoRetornoEspecifico', notificacao);
            });
          } else {
            this.socketService.sendSocket('NovoRetorno', null);
          }
          this.spinnerService.alterarSpinnerStatus(false);
          this.toastr.success('Cadastrado com sucesso!');
          this.router.navigate([`/atendimentos/retornos`]);
        }, error => {
          this.spinnerService.alterarSpinnerStatus(false);
          console.log(error.error);
        }
      );
    }
  }

  getUsuarios() {
    this.spinnerService.alterarSpinnerStatus(true);
    this.usuarioService.getUsuarios().subscribe(
      (_USUARIOS: Usuario[]) => {
      this.usuarios = _USUARIOS;
      this.usuarioLogado = _USUARIOS.filter(c => c.id === this.usuarioLogadoId)[0];
      this.usuarios.push(Object.assign({ id: 0, userName: 'TODOS'}));
      this.usuarioIdSelecionado = 0;
      this.spinnerService.alterarSpinnerStatus(false);
      }, error => {
        console.log(error.error);
        this.spinnerService.alterarSpinnerStatus(false);
        this.toastr.error(`Erro ao tentar carregar usuarios: ${error.error}`);
    });
  }

  getClientes() {
    this.spinnerService.alterarSpinnerStatus(true);
    this.clienteService.getClientesSelect().subscribe(
      (_CLIENTES: Cliente[]) => {
      this.clientes = _CLIENTES;
      this.spinnerService.alterarSpinnerStatus(false);
    }, error => {
      console.log(error.error);
      this.spinnerService.alterarSpinnerStatus(false);
      this.toastr.error(`Erro ao tentar carregar clientes: ${error.error}`);
    });
  }

}
