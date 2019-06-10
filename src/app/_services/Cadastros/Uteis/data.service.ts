import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  novaData: any;
constructor() { }

  getDataPTBR(data: any) {
    this.novaData = data.split('T')[0].split('-');
    const dia = this.novaData[2];
    const mes = this.novaData[1];
    const ano = this.novaData[0];
    return dia + '/' + mes + '/' + ano;
  }

  getDataSQL(data: any) {
    this.novaData = data.split(' ')[0].split('/');
    const dia = this.novaData[0];
    const mes = this.novaData[1];
    const ano = this.novaData[2];
    return ano + '-' + mes + '-' + dia;
  }
}
