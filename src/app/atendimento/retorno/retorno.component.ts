import { Component, OnInit } from '@angular/core';
import { Retorno } from 'src/app/_models/Atendimentos/Retornos/retorno';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClienteService } from 'src/app/_services/Cadastros/Clientes/cliente.service';
import { BsLocaleService, ModalDirective } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { RetornoService } from 'src/app/_services/Atendimentos/Retornos/retorno.service';
import { Cliente } from 'src/app/_models/Cadastros/Clientes/Cliente';
import { RetornoLog } from 'src/app/_models/Atendimentos/Retornos/retornoLog';
import * as moment from 'moment';
import { Subscription, interval } from 'rxjs';
import { RetornoObservacao } from 'src/app/_models/Atendimentos/Retornos/retornoObservacao';
import { Time } from '@angular/common';
import { SocketService } from 'src/app/_services/WebSocket/Socket.service';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { DataService } from 'src/app/_services/Cadastros/Uteis/data.service';
import { DataPeriodo } from 'src/app/_models/Cadastros/Uteis/DataPeriodo';

@Component({
  selector: 'app-retorno',
  templateUrl: './retorno.component.html'
})
export class RetornoComponent implements OnInit {

  cadastroObservacaoForm: FormGroup;
  observacao: RetornoObservacao;
  observacaoId: number;

  retornosFiltrados: Retorno[];
  retornos: Retorno[];
  retornosNaoFinalizados: Retorno[];
  retorno: Retorno;
  logRetorno: RetornoLog[];
  retornoObservacoes: RetornoObservacao[];
  retornoTelefone: string;
  retornoSolicitante: string;

  cadastroForm: FormGroup;

  cliente: Cliente;
  clientes: Cliente[];
  clienteIdSelecionado: any;

  paginaAtual = 1;
  totalRegistros = 0; number;

  filtrarPor = ['CLIENTE', 'DATA', 'PRIORIDADE'];
  filtroSelecionado = 'DATA';

  dataFiltro: any;
  valueDataFiltro: any;

  prioridades = ['NORMAL', 'URGENTE'];

  status = ['AGUARDANDO', 'EM ANDAMENTO', 'FINALIZADO', 'NÃO FINALIZADOS', 'TODOS'];

  statusFiltroSelecionado = 'NÃO FINALIZADOS';
  filtroRetorno: any;
  // tslint:disable-next-line:variable-name
  _filtroLista: string;

  countRetornos: number;
  private updateSubscription: Subscription;

  dataPeriodo: DataPeriodo;

  horaUltimaAtt: any;
  constructor(public fb: FormBuilder,
              private clienteServices: ClienteService,
              private retornoServices: RetornoService,
              private localeService: BsLocaleService,
              private toastr: ToastrService,
              private socketService: SocketService,
              public permissaoService: PermissaoService,
              private dataService: DataService) {
      this.localeService.use('pt-br');
    }

  ngOnInit() {
    this.getClientes();
    this.horaUltimaAtt = moment(new Date(), 'HH:mm:ss').format('HH:mm:ss');
    this.getRetornosNaoFinalizados();
    this.validationObservacao();
    this.getSocket('NovoRetorno');
    this.getSocket('StatusRetornoAlterado');
  }

  getSocket(evento: string) {
    this.socketService.getSocket(evento).subscribe((data: any) => {
      if (data === 'true') {
        this.getRetornosNaoFinalizados();

        if (evento === 'NovoRetorno') {
          const  notification = new Notification(`Olá, ${this.permissaoService.getUsuario()} !`, {
            body: 'Novo retorno!'
          });
        }
      }
    });
  }

  validationObservacao() {
    this.cadastroObservacaoForm = this.fb.group({
        id: [''],
        observacao: ['', Validators.required]
    });
  }

  getClientes() {
    this.clienteServices.getAllCliente().subscribe(
      (_CLIENTES: Cliente[]) => {
      this.clientes = _CLIENTES.filter(cliente => cliente.status === 'ATIVO');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar clientes: ${error.error}`);
    });
  }

  alterarStatus(retorno: any) {
    let newStatus;
    if (retorno.status === 'AGUARDANDO') {
      newStatus = 'EM ANDAMENTO';
    } else if (retorno.status === 'EM ANDAMENTO') {
      newStatus = 'AGUARDANDO';
    }

    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

    this.retorno = Object.assign(retorno, { status: newStatus});
    const retornoLog = Object.assign({ id: 0, retornoId: retorno.id,
       usuarioId: this.permissaoService.getUsuarioId(), dataHora: dataAtual, status: newStatus});

    this.retornoServices.editarRetorno(this.retorno).subscribe(
      () => {
        this.retornoServices.novoLog(retornoLog).subscribe(
          () => {
            this.toastr.success(`Status alterado para: ${newStatus}!`);
            this.socketService.sendSocket('StatusRetornoAlterado', 'true');
          }, error => {
            this.toastr.error(`Erro ao tentar criar log: ${error.error}`);
            console.log(error.error);
          });
      }, error => {
        this.toastr.error(`Erro ao tentar alterar status: ${error.error}`);
      });
  }

  finalizarRetorno(retorno: any) {
    const newStatus = 'FINALIZADO';
    this.retorno = Object.assign(retorno, { status: newStatus});

    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

    const retornoLog = Object.assign({ id: 0, retornoId: retorno.id,
       usuarioId: this.permissaoService.getUsuarioId(), dataHora: dataAtual, status: newStatus});
    this.retornoServices.editarRetorno(this.retorno).subscribe(
      () => {
        this.retornoServices.novoLog(retornoLog).subscribe(
          () => {
            this.toastr.success(`Retorno Finalizado!`);
            this.socketService.sendSocket('StatusRetornoAlterado', 'true');
          }, error => {
            this.toastr.error(`Erro ao tentar criar log: ${error.error}`);
            console.log(error.error);
          });
      }, error => {
        this.toastr.error(`Erro ao tentar alterar status: ${error.error}`);
        console.log(error.error);
      });
  }

  getCountLogsAguardando(retornoId: number) {
    this.retornoServices.getCountLogsAguardandoByRetornoId(retornoId).subscribe(
      (_COUNT: number) => {
        if (_COUNT > 0) {
          return `(${_COUNT})`;
        } else {
          return '';
        }
    });
  }

  retornoLog(retornoId: number, template: any) {
    this.retornoServices.getAllLogsByRetornoId(retornoId).subscribe(
      (_LOGS: RetornoLog[]) => {
      this.logRetorno = _LOGS;
    }, error => {
      this.toastr.error(`Erro ao tentar carregar retornoLog: ${error.error}`);
    });
    template.show();
  }

  getRetornoInformacoes(retornoId: number, telefone: string, solicitante: string, template: any) {
    this.observacaoId = retornoId;
    this.retornoTelefone = telefone;
    this.retornoSolicitante = solicitante;
    this.retornoServices.getAllObservacoesByRetornoId(retornoId).subscribe(
      (_OBSERVACOES: RetornoObservacao[]) => {
      this.retornoObservacoes = _OBSERVACOES;
    }, error => {
      this.toastr.error(`Erro ao tentar carregar observacoes: ${error.error}`);
    });
    if (template !== null) {
      template.show();
    }
  }

  get filtroLista() {
    return this._filtroLista;
  }

  set filtroLista(value: string) {
    this._filtroLista = value;
    this.retornosFiltrados = this.filtroLista ? this.filtrarRetornos(this.filtroLista) : this.retornos;
  }

  setFiltroSelecionado(valor: any) {
    this.filtroSelecionado = valor;
  }

  setDataFiltro(valor: Date[]) {
    this.dataPeriodo = Object.assign(
      {
        dataInicial: this.dataService.getDataSQL(valor[0].toLocaleString()) + 'T00:00:00',
        dataFinal: this.dataService.getDataSQL(valor[1].toLocaleString()) + 'T23:59:00'
      }
    );
    this.getRetornosByPeriodo(this.dataPeriodo);
  }

  setStatusFiltroSelecionado(valor: any) {
    this.statusFiltroSelecionado = valor;
    if (valor !== 'NÃO FINALIZADOS') {
      this.getAllRetornos();
    } else {
      this.getRetornosNaoFinalizados();
    }
    this.retornosFiltrados = this.filtrarRetornos(this.filtroLista);
  }

  compararNumeros(a, b) {
    return a - b;
  }

  filtrarRetornos(filtrarPor: any): Retorno[] {
    if (this.statusFiltroSelecionado !== 'TODOS' && this.statusFiltroSelecionado !== 'NÃO FINALIZADOS') {
      this.filtroRetorno = this.retornos.filter(_RETORNO => _RETORNO.status === this.statusFiltroSelecionado);
    } else {
      this.filtroRetorno = this.retornos;
    }

    if (this.statusFiltroSelecionado === 'FINALIZADOS') {
      this.filtroRetorno = this.filtroRetorno.sort(this.compararNumeros);
    }

    if (this.filtroSelecionado === 'CLIENTE') {
      this.filtroRetorno = this.retornos.filter(_RETORNO => _RETORNO.clienteId === filtrarPor);
    }

    if (this.filtroSelecionado === 'PRIORIDADE') {
      this.filtroRetorno = this.retornos.filter(_RETORNO => _RETORNO.prioridade === filtrarPor);
    }

    this.totalRegistros = this.filtroRetorno.length;
    return this.filtroRetorno;
  }

  getAllRetornos() {
      this.retornoServices.getAllRetornos().subscribe(
        (_RETORNOS: Retorno[]) => {
        this.horaUltimaAtt = moment(new Date(), 'HH:mm:ss').format('HH:mm:ss');
        this.retornos = _RETORNOS;
        this.countRetornos = _RETORNOS.length;
        this.retornosFiltrados = this.filtrarRetornos(this.filtroLista);
      }, error => {
        console.log(error.error);
        this.toastr.error(`Erro ao tentar carregar retornos: ${error.error}`);
      });
  }

  getRetornosByPeriodo(datas: DataPeriodo) {
    this.retornoServices.getRetornosByPeriodo(datas).subscribe(
      (_RETORNOS: any) => {
      this.horaUltimaAtt = moment(new Date(), 'HH:mm:ss').format('HH:mm:ss');
      this.retornos = _RETORNOS;
      this.countRetornos = _RETORNOS.length;
      this.retornosFiltrados = this.filtrarRetornos(this.filtroLista);
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar retornos: ${error.error}`);
    });
}

  getRetornosNaoFinalizados() {
    this.retornoServices.getRetornosNaoFinalizados().subscribe(
      (_RETORNOS: Retorno[]) => {
      this.horaUltimaAtt = moment(new Date(), 'HH:mm:ss').format('HH:mm:ss');
      this.retornos = _RETORNOS;
      this.countRetornos = _RETORNOS.length;
      this.retornosFiltrados = this.filtrarRetornos(this.filtroLista);
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar retornos: ${error.error}`);
    });
}

  novaObservacao() {
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    if (this.cadastroObservacaoForm.valid) {
      this.observacao = Object.assign(this.cadastroObservacaoForm.value, {id: 0, retornoId: this.observacaoId,
      usuarioId: this.permissaoService.getUsuarioId(), dataHora: dataAtual});

      this.retornoServices.novaObservacao(this.observacao).subscribe(
        () => {
          this.getRetornoInformacoes(this.observacaoId, this.retornoTelefone, this.retornoSolicitante, null);
          this.toastr.success('Observação cadastrada com sucesso!');
          const InfoObs = Object.assign({retornoId: this.observacaoId, usuario: this.permissaoService.getUsuario()});
          this.socketService.sendSocket('NovaObservacao', InfoObs);
        }, error => {
          console.log(error.error);
        }
      );
    }
  }
}
