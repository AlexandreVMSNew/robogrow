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

@Component({
  selector: 'app-novo-retorno',
  templateUrl: './novoRetorno.component.html',
  styleUrls: ['./novoRetorno.component.css']
})
export class NovoRetornoComponent implements OnInit {

  cadastroForm: FormGroup;
  retorno: Retorno;
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
              private changeDetectionRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.getClientes();
    this.getUsuarios();
    this.validation();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewChecked() {
    this.changeDetectionRef.detectChanges();
  }

  validation() {
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
      console.log(this.retorno.usuarioId);
      this.retornoService.novoRetorno(this.retorno).subscribe(
        () => {
          if (this.retorno.usuarioId !== 0) {
            this.notificacao = Object.assign({usuarioId: this.retorno.usuarioId, dataHora: dataAtual, tipo: 'Retorno', visto: 0});
            this.notificacaoService.novaNotificacao(this.notificacao).subscribe(
              () => {
                this.toastr.success('Cadastrado com sucesso!');
                this.router.navigate([`/atendimentos/retornos`]);
              });
          } else {
          this.toastr.success('Cadastrado com sucesso!');
          this.router.navigate([`/atendimentos/retornos`]);
          }
        }, error => {
          console.log(error.error);
        }
      );
    }
  }


}
