import { Component, OnInit } from '@angular/core';
import { Retorno } from 'src/app/_models/Atendimentos/Retornos/retorno';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClienteService } from 'src/app/_services/Cadastros/Clientes/cliente.service';
import { BsLocaleService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { RetornoService } from 'src/app/_services/Atendimentos/Retornos/retorno.service';
import { Cliente } from 'src/app/_models/Cadastros/Clientes/Cliente';
import { RetornoLog } from 'src/app/_models/Atendimentos/Retornos/retornoLog';
import * as moment from 'moment';
import { InfoUsuario } from 'src/app/_models/Info/infoUsuario';
import { Subscription, interval } from 'rxjs';
import { RetornoObservacao } from 'src/app/_models/Atendimentos/Retornos/retornoObservacao';
import { Time } from '@angular/common';

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
  totalRegistros: number;

  filtrarPor = ['CLIENTE', 'DATA', 'PRIORIDADE'];
  filtroSelecionado = 'DATA';

  dataFiltro: any;
  valueDataFiltro: any;

  prioridades = ['NORMAL', 'URGENTE'];

  status = ['AGUARDANDO', 'EM ANDAMENTO', 'FINALIZADO', 'TODOS'];

  statusFiltroSelecionado = 'TODOS';
  filtroRetorno: any;
  // tslint:disable-next-line:variable-name
  _filtroLista: string;

  countRetornos: number;
  private updateSubscription: Subscription;

  InfoUsuario = InfoUsuario;

  horaUltimaAtt: any;

  constructor(public fb: FormBuilder,
              private clienteServices: ClienteService,
              private retornoServices: RetornoService,
              private localeService: BsLocaleService,
              private toastr: ToastrService) {
      this.localeService.use('pt-br');
    }

  ngOnInit() {
    this.getClientes();
    this.horaUltimaAtt = moment(new Date(), 'HH:mm:ss').format('HH:mm:ss');
    this.getRetornos();
    this.validationObservacao();
    this.updateSubscription = interval(10000).subscribe(
      async (val) => {
        this.atualizarPagina(false);
      });
  }

  atualizarPagina(forcarAtt: boolean) {
    this.retornoServices.getCountRetornos().subscribe(
      (_COUNT: number) => {
        this.horaUltimaAtt = moment(new Date(), 'HH:mm:ss').format('HH:mm:ss');
        if (forcarAtt === true) {
          this.getRetornos();
          if ((this.countRetornos !== _COUNT && _COUNT > 0)) {
            const  notification = new Notification(`Olá, ${InfoUsuario.usuario} !`, {
              body: 'Novo retorno!'
            });
          }
        } else if (this.countRetornos !== _COUNT && _COUNT > 0) {
          this.getRetornos();
          const  notification = new Notification(`Olá, ${InfoUsuario.usuario} !`, {
            body: 'Novo retorno!'
          });
        }
        this.countRetornos = _COUNT;
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
       usuarioId: InfoUsuario.id, dataHora: dataAtual, status: newStatus});

    this.retornoServices.editarRetorno(this.retorno).subscribe(
      () => {
        this.retornoServices.novoLog(retornoLog).subscribe(
          () => {
            this.toastr.success(`Status alterado para: ${newStatus}!`);
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
       usuarioId: InfoUsuario.id, dataHora: dataAtual, status: newStatus});
    this.retornoServices.editarRetorno(this.retorno).subscribe(
      () => {
        this.retornoServices.novoLog(retornoLog).subscribe(
          () => {
            this.toastr.success(`Retorno Finalizado!`);
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

  setDataFiltro(valor: any) {
    this.dataFiltro = valor;
  }

  setStatusFiltroSelecionado(valor: any) {
    this.statusFiltroSelecionado = valor;
    this.retornosFiltrados = this.filtrarRetornos(this.filtroLista);
  }

  filtrarRetornos(filtrarPor: string): Retorno[] {
    if (this.statusFiltroSelecionado !== 'TODOS') {
      this.filtroRetorno = this.retornos.filter(_RETORNO => _RETORNO.status === this.statusFiltroSelecionado);
    } else {
      this.filtroRetorno = this.retornos;
    }

    this.totalRegistros = this.filtroRetorno.length;
    return this.filtroRetorno;
  }

  getRetornos() {
      this.retornoServices.getAllRetornos().subscribe(
        (_RETORNOS: Retorno[]) => {
        this.retornos = _RETORNOS;
        this.countRetornos = _RETORNOS.length;
        this.retornosFiltrados = this.filtrarRetornos(this.filtroLista);
      }, error => {
        console.log(error.error);
        this.toastr.error(`Erro ao tentar carregar retornos: ${error.error}`);
      });
  }

  novaObservacao(template: any) {
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    if (this.cadastroObservacaoForm.valid) {
      this.observacao = Object.assign(this.cadastroObservacaoForm.value, {id: 0, retornoId: this.observacaoId,
      usuarioId: InfoUsuario.id, dataHora: dataAtual});

      this.retornoServices.novaObservacao(this.observacao).subscribe(
        () => {
          this.getRetornoInformacoes(this.observacaoId, this.retornoTelefone, this.retornoSolicitante, null);
          this.toastr.success('Observação cadastrada com sucesso!');
          template.hide();
        }, error => {
          console.log(error.error);
        }
      );
    }
  }
}
