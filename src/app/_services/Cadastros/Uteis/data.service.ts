import { Injectable } from '@angular/core';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  novaData: any;
constructor() { }

  getDataPTBR(data: any) {
    if (data && data !== null && data.toString().length > 0) {
      this.novaData = data.split('T')[0].split('-');
      const dia = this.novaData[2];
      const mes = this.novaData[1];
      const ano = this.novaData[0];
      return dia + '/' + mes + '/' + ano;
    } else {
      return '';
    }
  }

  getDataSQL(data: any) {
    if (data && data !== null && data.toString().length > 0) {
      this.novaData = data.split(' ')[0].split('/');
      const dia = this.novaData[0];
      const mes = this.novaData[1];
      const ano = this.novaData[2];
      return ano + '-' + mes + '-' + dia;
    } else {
      return null;
    }
  }

  calculaDiferencaDataHora(dataInicial: any) {
    const dataHoraAtual  = moment(new Date(), 'DD/MM/YYYY HH:mm:ss');

    const ms = moment(dataHoraAtual, 'DD/MM/YYYY HH:mm:ss').diff(moment(dataInicial, 'DD/MM/YYYY HH:mm:ss'));
    const d = moment.duration(ms);

    if (d.asHours() > 23) {
      return Number(d.asHours() / 24).toFixed(0) + ' dia(s)';
    } else {
      return Math.floor(d.asHours()) + moment.utc(ms).format(':mm:ss');
    }
}
}
