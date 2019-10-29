import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Retorno } from 'src/app/_models/Atendimentos/Retornos/retorno';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClienteService } from 'src/app/_services/Cadastros/Clientes/cliente.service';
import { BsLocaleService, ModalDirective, BsDatepickerConfig } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { RetornoService } from 'src/app/_services/Atendimentos/Retornos/retorno.service';
import { Cliente } from 'src/app/_models/Cadastros/Clientes/Cliente';
import { RetornoLog } from 'src/app/_models/Atendimentos/Retornos/retornoLog';
import * as moment from 'moment';
import { RetornoObservacao } from 'src/app/_models/Atendimentos/Retornos/retornoObservacao';
import { SocketService } from 'src/app/_services/WebSocket/Socket.service';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { DataService } from 'src/app/_services/Cadastros/Uteis/data.service';
import { DataPeriodo } from 'src/app/_models/Cadastros/Uteis/DataPeriodo';
import { SpinnerService } from 'src/app/_services/Uteis/Spinner/spinner.service';
import { EditarClienteComponent } from 'src/app/cadastros/cliente/editarCliente/editarCliente.component';
import { TemplateModalService } from 'src/app/_services/Uteis/TemplateModal/templateModal.service';

@Component({
  selector: 'app-retorno',
  templateUrl: './retorno.component.html',
  styles: [`
    :host >>> .popover {
      max-width: 100% !important;
    }
    :host >>> .popover>.arrow:after {
        max-width: 100% !important;
  }`]
})
export class RetornoComponent implements OnInit, AfterViewChecked {

  cadastroObservacaoForm: FormGroup;
  observacao: RetornoObservacao;
  retornoId: number;

  retornosFiltrados: Retorno[] = [];
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
  totalRegistros = 0; number;

  dataValue: any;

  prioridades = ['NORMAL', 'URGENTE', 'TODOS'];
  prioridadesSelecionado = 'TODOS';

  status = ['AGUARDANDO', 'EM ANDAMENTO', 'FINALIZADO', 'NÃO FINALIZADO', 'TODOS'];
  statusSelecionado = 'NÃO FINALIZADO';

  countRetornos: number;

  dataPeriodo: DataPeriodo;

  horaUltimaAtt: any;

  templateModalService = new TemplateModalService();
  editarClienteComponent = EditarClienteComponent;
  inputs: any;
  componentModal: any;

  constructor(public fb: FormBuilder,
              private clienteService: ClienteService,
              private retornoService: RetornoService,
              private spinnerService: SpinnerService,
              private localeService: BsLocaleService,
              private toastr: ToastrService,
              private socketService: SocketService,
              public permissaoService: PermissaoService,
              private changeDetectionRef: ChangeDetectorRef,
              private dataService: DataService) {
      this.localeService.use('pt-br');
    }

    ngAfterViewChecked() {
      this.changeDetectionRef.detectChanges();
    }

  ngOnInit() {
    this.getClientes();
    this.validarObservacao();
    this.dataPeriodo = Object.assign(
      {
        dataInicial: this.dataService.getDataSQL(moment(new Date(), 'DD/MM/YYYY').format('DD/MM/YYYY')) + 'T00:00:00',
        startDate: moment(new Date(), 'DD/MM/YYYY').format('DD/MM/YYYY'),
        dataFinal: this.dataService.getDataSQL(moment(new Date(), 'DD/MM/YYYY').format('DD/MM/YYYY')) + 'T23:59:00',
        endDate: moment(new Date(), 'DD/MM/YYYY').format('DD/MM/YYYY'),
      }
    );
    this.pesquisarRetorno(this.dataPeriodo);

    this.getSocket('CadastrarRetorno');
    this.getSocket('StatusRetornoAlterado');
  }

  getSocket(evento: string) {
    this.socketService.getSocket(evento).subscribe((info: any) => {
      if (info === null) {

        if (evento === 'CadastrarRetorno') {
          const  notification = new Notification(`Olá, ${this.permissaoService.getUsuario()} !`, {
            body: 'Cadastrar retorno!'
          });
        }
        this.pesquisarRetorno(this.dataPeriodo);
      }
    });
  }

  validarObservacao() {
    this.cadastroObservacaoForm = this.fb.group({
        id: [''],
        observacao: ['', Validators.required]
    });
  }

  alterarStatus(retorno: any) {
    this.spinnerService.alterarSpinnerStatus(true);
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

    this.retornoService.editarRetorno(this.retorno).subscribe(() => {
      this.retornoService.cadastrarLog(retornoLog).subscribe(
        () => {
          this.spinnerService.alterarSpinnerStatus(false);
          this.toastr.success(`Status alterado para: ${newStatus}!`);
          this.socketService.sendSocket('StatusRetornoAlterado', null);
        }, error => {
          this.spinnerService.alterarSpinnerStatus(false);
          this.toastr.error(`Erro ao tentar criar log: ${error.error}`);
          console.log(error.error);
        });
    }, error => {
      this.spinnerService.alterarSpinnerStatus(false);
      this.toastr.error(`Erro ao tentar alterar status: ${error.error}`);
    });
  }

  finalizarRetorno(retorno: any) {
    this.spinnerService.alterarSpinnerStatus(true);
    const newStatus = 'FINALIZADO';
    this.retorno = Object.assign(retorno, { status: newStatus});

    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

    const retornoLog = Object.assign({ id: 0, retornoId: retorno.id,
       usuarioId: this.permissaoService.getUsuarioId(), dataHora: dataAtual, status: newStatus});
    this.retornoService.editarRetorno(this.retorno).subscribe(
      () => {
        this.retornoService.cadastrarLog(retornoLog).subscribe(
          () => {
            this.spinnerService.alterarSpinnerStatus(false);
            this.toastr.success(`Retorno Finalizado!`);
            this.socketService.sendSocket('StatusRetornoAlterado', null);
          }, error => {
            this.spinnerService.alterarSpinnerStatus(false);
            this.toastr.error(`Erro ao tentar criar log: ${error.error}`);
            console.log(error.error);
          });
      }, error => {
        this.spinnerService.alterarSpinnerStatus(false);
        this.toastr.error(`Erro ao tentar alterar status: ${error.error}`);
        console.log(error.error);
      });
  }

  retornoLog(retornoId: number, template: any) {
    this.spinnerService.alterarSpinnerStatus(true);
    this.retornoService.getLogsByRetornoId(retornoId).subscribe(
      (_LOGS: RetornoLog[]) => {
      this.logRetorno = _LOGS;
      this.spinnerService.alterarSpinnerStatus(false);
    }, error => {
      this.toastr.error(`Erro ao tentar carregar retornoLog: ${error.error}`);
      this.spinnerService.alterarSpinnerStatus(false);
    });
    template.show();
  }

  getRetornoInformacoes(retornoId: number, telefone: string, solicitante: string, template: any) {
    this.spinnerService.alterarSpinnerStatus(true);
    this.retornoObservacoes = [];
    this.validarObservacao();
    this.retornoId = retornoId;
    this.retornoTelefone = telefone;
    this.retornoSolicitante = solicitante;

    this.retornoService.getObservacoesByRetornoId(retornoId).subscribe(
      (_OBSERVACOES: RetornoObservacao[]) => {
      this.retornoObservacoes = _OBSERVACOES;
      this.spinnerService.alterarSpinnerStatus(false);
    }, error => {
      this.toastr.error(`Erro ao tentar carregar observacoes: ${error.error}`);
      this.spinnerService.alterarSpinnerStatus(false);
    });
    if (template !== null) {
      template.show();
    }
  }

  setDataFiltro(valor: any) {
    const dataStart = (valor.dataInicial) ? valor.dataInicial : valor.dataInicial;
    const dataEnd = (valor.dataFinal) ? valor.dataFinal : valor.dataFinal;
    this.dataPeriodo = Object.assign(
      {
        dataInicial: dataStart,
        dataFinal: dataEnd
      }
    );
  }

  compararNumeros(a, b) {
    return a - b;
  }

  filtrarRetornos() {
    this.retornosFiltrados = this.retornos;
    if (this.statusSelecionado !== 'TODOS' && this.statusSelecionado !== 'NÃO FINALIZADO' ) {
      this.retornosFiltrados = this.retornosFiltrados.filter(_RETORNO => _RETORNO.status === this.statusSelecionado);
    } else if (this.statusSelecionado === 'NÃO FINALIZADO') {
      this.retornosFiltrados = this.retornosFiltrados.filter(_RETORNO => _RETORNO.status !== 'FINALIZADO');
    }

    if (this.statusSelecionado === 'FINALIZADO') {
      this.retornosFiltrados = this.retornosFiltrados.sort(this.compararNumeros);
    }

    if (this.prioridadesSelecionado !== 'TODOS') {
      this.retornosFiltrados = this.retornosFiltrados.filter(_RETORNO => _RETORNO.prioridade === this.prioridadesSelecionado);
    }

    if (this.clienteIdSelecionado) {
      this.retornosFiltrados = this.retornosFiltrados.filter(_RETORNO => _RETORNO.clienteId === this.clienteIdSelecionado);
    }

    this.totalRegistros = this.retornosFiltrados.length;
    this.spinnerService.alterarSpinnerStatus(false);
  }

  pesquisarRetorno(datas: DataPeriodo) {
    this.getRetornosByPeriodo(datas);
  }

  getRetornosByPeriodo(datas: DataPeriodo) {
    this.retornos = [];
    this.retornosFiltrados = [];
    this.spinnerService.alterarSpinnerStatus(true);
    this.retornoService.getRetornosByPeriodo(datas).subscribe(
      (_RETORNOS: any) => {
      this.horaUltimaAtt = moment(new Date(), 'HH:mm:ss').format('HH:mm:ss');
      this.retornos = _RETORNOS;
      this.countRetornos = _RETORNOS.length;
      this.filtrarRetornos();
    }, error => {
      console.log(error.error);
      this.spinnerService.alterarSpinnerStatus(false);
      this.toastr.error(`Erro ao tentar carregar retornos: ${error.error}`);
    });
  }

  novaObservacao() {
    this.spinnerService.alterarSpinnerStatus(true);
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    if (this.cadastroObservacaoForm.valid) {
      this.observacao = Object.assign(this.cadastroObservacaoForm.value, {id: 0, retornoId: this.retornoId,
      usuarioId: this.permissaoService.getUsuarioId(), dataHora: dataAtual});

      this.retornoService.novaObservacao(this.observacao).subscribe(
        () => {
          this.getRetornoInformacoes(this.retornoId, this.retornoTelefone, this.retornoSolicitante, null);
          this.toastr.success('Observação cadastrada com sucesso!');

          const notificacao = Object.assign({
            id: 0,
            usuarioId: 0,
            dataHora: dataAtual,
            titulo: 'Nova Observação!',
            mensagem: `O Usuário ${this.permissaoService.getUsuario()} adicionou\n
            uma nova observação no Retorno ${this.retornoId}.`,
            visto: 0
          });
          this.socketService.sendSocket('NovaObservacao', notificacao);
          this.spinnerService.alterarSpinnerStatus(false);
        }, error => {
          this.spinnerService.alterarSpinnerStatus(false);
          console.log(error.error);
        }
      );
    }
  }

  abrirTemplateModal(component, clienteId: number) {
    this.componentModal = component;
    this.inputs = Object.assign({idCliente: clienteId});
    this.templateModalService.setTemplateModalStatus(true);
  }

  getTemplateModal() {
    return this.templateModalService.getTemplateModalStatus();
  }

  getClientes() {
    this.spinnerService.alterarSpinnerStatus(true);
    this.clienteService.getCliente().subscribe(
      (_CLIENTES: Cliente[]) => {
      this.clientes = _CLIENTES.filter(cliente => cliente.status === 'ATIVO');
      this.spinnerService.alterarSpinnerStatus(false);
    }, error => {
      console.log(error.error);
      this.spinnerService.alterarSpinnerStatus(false);
      this.toastr.error(`Erro ao tentar carregar clientes: ${error.error}`);
    });
  }

}
