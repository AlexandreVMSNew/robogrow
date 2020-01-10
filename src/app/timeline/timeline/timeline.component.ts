import { Component, OnInit, Input } from '@angular/core';
import { TemplateModalService } from 'src/app/_services/Uteis/TemplateModal/templateModal.service';
import { DataPeriodo } from 'src/app/_models/Cadastros/Uteis/DataPeriodo';
import { DataService } from 'src/app/_services/Cadastros/Uteis/data.service';
import * as moment from 'moment';
import { NotificacaoService } from 'src/app/_services/Notificacoes/notificacao.service';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { Timeline } from 'src/app/_models/TimeLine/Timeline';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})

export class TimelineComponent implements OnInit {

  timeline: Timeline[] = [];
  usuarioLogadoId: number;

  dataPeriodo: DataPeriodo;

  inputs: any;
  componentModal: any;

  constructor(private dataService: DataService,
              private router: ActivatedRoute,
              private permissaoService: PermissaoService,
              private notificacaoService: NotificacaoService) {
                this.notificacaoService.atualizaNotificacoes.subscribe(x => {
                  this.carregarNotificacoes();
                });
              }

  ngOnInit() {
    this.usuarioLogadoId = this.permissaoService.getUsuarioId();
    this.dataPeriodo = Object.assign(
      {
        dataInicial: this.dataService.getDataSQL(moment().startOf('month').format('DD/MM/YYYY')) + 'T00:00:00',
        startDate: moment().startOf('month').format('DD/MM/YYYY'),
        dataFinal: this.dataService.getDataSQL(moment(new Date(), 'DD/MM/YYYY').format('DD/MM/YYYY')) + 'T23:59:00',
        endDate: moment(new Date(), 'DD/MM/YYYY').format('DD/MM/YYYY'),
      }
    );
    this.carregarNotificacoes();
  }

  carregarNotificacoes() {
    this.notificacaoService.getNotificacoesByUsuarioIdMarcado(this.dataPeriodo, this.usuarioLogadoId)
    .subscribe((timeline: Timeline[]) => {
      this.timeline = timeline;
    }, error => {
      console.log(error.error);
    });
  }

  pesquisarTimeline() {
    this.carregarNotificacoes();
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


  abrirComponentModal(componentIdentificacao: string) {
    const informacoes = componentIdentificacao.split('/');

    if (informacoes.length > 0) {
      if (informacoes[0] === 'publicacao') {

      }
    }
  }

}
