import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

@Component({
  selector: 'app-novo-retorno',
  templateUrl: './novoRetorno.component.html'

})
export class NovoRetornoComponent implements OnInit {

  cadastroForm: FormGroup;
  retorno: Retorno;
  retornoObservacao: RetornoObservacao;
  _observacao = '';
  notificacao: Notificacao;

  prioridades = ['NORMAL', 'URGENTE'];
  prioridadeSelecionado = 'NORMAL';

  cliente: Cliente;
  clientes: Cliente[];
  clienteIdSelecionado: any;

  usuarios: Usuario[];
  usuarioIdSelecionado: any;

  valueTelefonePipe = '';

  dataHoraAtual = new Date();

  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private clienteService: ClienteService,
              private usuarioService: UsuarioService,
              private retornoService: RetornoService,
              private notificacaoService: NotificacaoService,
              private router: Router,
              private changeDetectionRef: ChangeDetectorRef,
              private socketService: SocketService,
              public permissaoService: PermissaoService) { }

  ngOnInit() {
    this.getClientes();
    this.getUsuarios();
    this.validarForm();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewChecked() {
    this.changeDetectionRef.detectChanges();
  }

  get observacaoTexto(): string {
    return this._observacao;
  }

  set observacaoTexto(value: string) {
    this._observacao = value;
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

  getUsuarios() {
    this.usuarioService.getAllUsuario().subscribe(
      (_USUARIOS: Usuario[]) => {
      this.usuarios = _USUARIOS;
      this.usuarios.push(Object.assign({ id: 0, userName: 'TODOS'}));
      this.usuarioIdSelecionado = 0;
      }, error => {
        console.log(error.error);
        this.toastr.error(`Erro ao tentar carregar usuarios: ${error.error}`);
    });
  }

  getClientes() {
    this.clienteService.getAllCliente().subscribe(
      (_CLIENTES: Cliente[]) => {
      this.clientes = _CLIENTES.filter(cliente => cliente.status === 'ATIVO');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar clientes: ${error.error}`);
    });
  }

  cadastrarRetorno() {
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    if (this.cadastroForm.valid) {
      this.retorno = Object.assign(this.cadastroForm.value, {id: 0, status: 'AGUARDANDO', dataHora: dataAtual});

      this.retornoService.novoRetorno(this.retorno).subscribe(
        () => {

          this.retornoService.getIdUltimoRetorno().subscribe((ultimoId: number) => {
            if (this._observacao !== '') {
              this.retornoObservacao = Object.assign({id: 0, retornoId: ultimoId,
              usuarioId: this.permissaoService.getUsuarioId(), dataHora: dataAtual, observacao: this._observacao});
              this.retornoService.novaObservacao(this.retornoObservacao).subscribe();
            }

            const retornoLog = Object.assign({ id: 0, retornoId: ultimoId,
              usuarioId: this.permissaoService.getUsuarioId(), dataHora: dataAtual, status: 'AGUARDANDO'});

            this.retornoService.novoLog(retornoLog).subscribe(
              () => {
                this.toastr.success(`Retorno Finalizado!`);
                this.socketService.sendSocket('StatusRetornoAlterado', 'true');
              }, error => {
                this.toastr.error(`Erro ao tentar criar log: ${error.error}`);
                console.log(error.error);
              });
          });

          if (this.retorno.usuarioId !== 0) {
            this.notificacao = Object.assign({usuarioId: this.retorno.usuarioId, dataHora: dataAtual, tipo: 'Retorno', visto: 0});
            this.notificacaoService.novaNotificacao(this.notificacao).subscribe(
              () => {
                this.socketService.sendSocket('NotificacaoUsuarioRetorno', this.retorno.usuarioId);
                this.toastr.success('Cadastrado com sucesso!');
                this.router.navigate([`/atendimentos/retornos`]);
              });
          } else {
            this.toastr.success('Cadastrado com sucesso!');
            this.router.navigate([`/atendimentos/retornos`]);
          }

          this.socketService.sendSocket('NovoRetorno', 'true');
        }, error => {
          console.log(error.error);
        }
      );
    }
  }


}
