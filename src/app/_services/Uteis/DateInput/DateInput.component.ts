import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { DataService } from '../../Cadastros/Uteis/data.service';

@Component({
  selector: 'app-date-input',
  templateUrl: './DateInput.component.html',
  styleUrls: ['./DateInput.component.css']
})
export class DateInputComponent implements OnInit {

  @Input() datas: any;
  @Output() ngModel = new EventEmitter();

  locale = {
    format: 'DD/MM/YYYY',
    direction: 'ltr',
    separator: ' - ',
    applyLabel: 'Aplicar',
    cancelLabel: 'Cancelar',
    fromLabel: 'De',
    toLabel: 'Para',
    customRangeLabel: 'Personalizar',
    weekLabel: 'W',
    daysOfWeek: [
        'D',
        'S',
        'T',
        'Q',
        'Q',
        'S',
        'S'
    ],
    monthNames: [
        'JANEIRO',
        'FEVEREIRO',
        'MARÇO',
        'ABRIL',
        'MAIO',
        'JUNHO',
        'JULHO',
        'AGOSTO',
        'SETEMBRO',
        'OUTUBRO',
        'NOVEMBRO',
        'DEZEMBRO'
    ],
    firstDay: 1
  };

  ranges: any = {
    'Hoje': [moment(), moment()],
    'Ontem': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Últimos 7 Dias': [moment().subtract(6, 'days'), moment()],
    'Últimos 30 Dias': [moment().subtract(29, 'days'), moment()],
    'Este Mês': [moment().startOf('month'), moment().endOf('month')],
    'Último Mês': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  };

  constructor(private dataService: DataService) { }

  ngOnInit() {
  }

  setData(datas) {
    this.datas = Object.assign(
      {
        dataInicial: (datas.startDate) ? this.dataService.getDataSQL(datas.startDate._d.toLocaleString()) + 'T00:00:00'
                                       : this.datas.dataInicial,
        dataFinal: (datas.endDate) ? this.dataService.getDataSQL(datas.endDate._d.toLocaleString()) + 'T23:59:00'
                                   : this.datas.dataFinal
      }
    );
    this.ngModel.emit(this.datas);
  }

}
