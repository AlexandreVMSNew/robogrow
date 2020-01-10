import { Injectable } from '@angular/core';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  novaData: any;
  novaHora: any;
constructor() {
 }

  getDataPTBR(data: any) {
    if (data && data !== null && data.toString().length > 0) {
      if (data.includes('T')) {
        this.novaData = data.split('T')[0].split('-');
      } else {
        this.novaData = data.split('-');
      }
      const dia = this.novaData[2];
      const mes = this.novaData[1];
      const ano = this.novaData[0];
      return dia + '/' + mes + '/' + ano;
    } else {
      return '';
    }
  }

  getDataHoraPTBR(data: any) {
    if (data && data !== null && data.toString().length > 0) {
      if (data.includes('T')) {
        this.novaData = data.split('T')[0].split('-');
        this.novaHora = data.split('T')[1].split(':');
      } else {
        this.novaData = data.split('-');
      }
      const dia = this.novaData[2];
      const mes = this.novaData[1];
      const ano = this.novaData[0];

      const hora = this.novaHora[0];
      const minuto = this.novaHora[1];
      return dia + '/' + mes + '/' + ano + ' ' + hora + ':' + minuto;
    } else {
      return '';
    }
  }

  getDataSQL(data: any) {
    if (data && data !== null && data.toString().length > 0) {
      if (data.includes(' ')) {
        this.novaData = data.split(' ')[0].split('/');
      } else {
        this.novaData = data.split('/');
      }
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
