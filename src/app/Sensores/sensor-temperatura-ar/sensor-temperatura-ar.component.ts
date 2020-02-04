import { Component, OnInit } from '@angular/core';
import { SensorTemperaturaAr } from 'src/app/_models/Sensores/SensorTemperaturaAr/SensorTemperaturaAr';
import { DataService } from 'src/app/_services/Cadastros/Uteis/data.service';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { SensorTemperaturaArService } from 'src/app/_services/Sensores/SensorTemperaturaAr/SensorTemperaturaAr.service';
import { DataPeriodo } from 'src/app/_models/Cadastros/Uteis/DataPeriodo';
import * as moment from 'moment';

@Component({
  selector: 'app-sensor-temperatura-ar',
  templateUrl: './sensor-temperatura-ar.component.html',
  styleUrls: ['./sensor-temperatura-ar.component.css']
})
export class SensorTemperaturaArComponent implements OnInit {

  infoSensorTemperaturaAr: SensorTemperaturaAr[] = [];

  lineChartData: ChartDataSets[];
  lineChartLabels: Label[];


  dataValue: any;

  itensQuantidadeRegistros = [50, 100, 200, 400, 800];
  quantidadeRegistrosSelecionado = 100;

  countRetornos: number;

  dataPeriodo: DataPeriodo;

  horaUltimaAtt: any;

  constructor(private dataService: DataService,
              private sensorTemperaturaArService: SensorTemperaturaArService) { }

  ngOnInit() {
    this.dataPeriodo = Object.assign(
      {
        dataInicial: this.dataService.getDataSQL(moment(new Date(), 'DD/MM/YYYY').format('DD/MM/YYYY')) + 'T00:00:00',
        dataFinal: this.dataService.getDataSQL(moment(new Date(), 'DD/MM/YYYY').format('DD/MM/YYYY')) + 'T23:59:00',
        endDate: moment(new Date(), 'DD/MM/YYYY').format('DD/MM/YYYY'),
        quantidadeRegistros: this.quantidadeRegistrosSelecionado
      }
    );
    this.buscarTemperaturaUmidadeAr(this.dataPeriodo);
  }

  carregarGraficoLine() {
    const umidades = [];
    const temperaturas = [];
    const sensacaoTermicas = [];
    const momentos = [];
    this.infoSensorTemperaturaAr.forEach((informacao: SensorTemperaturaAr) => {
      umidades.push(informacao.umidade);
      temperaturas.push(informacao.temperatura);
      sensacaoTermicas.push(informacao.sensacaoTemperatura);
      momentos.push(this.dataService.getDataHoraPTBR(informacao.dataHora));
    });

    this.lineChartData =  [
      { data: umidades, label: 'Umidade' },
      { data: temperaturas, label: 'Temperatura' },
      { data: sensacaoTermicas, label: 'Sensação Térmica' }
    ];

    this.lineChartLabels = momentos;
  }

  buscarTemperaturaUmidadeAr(dataPeriodo: DataPeriodo) {
    dataPeriodo = Object.assign(dataPeriodo, {quantidadeRegistros: this.quantidadeRegistrosSelecionado});
    this.sensorTemperaturaArService.buscarTemperaturaUmidadeAr(dataPeriodo).subscribe((informacoes: SensorTemperaturaAr[]) => {
      this.horaUltimaAtt = moment(new Date(), 'HH:mm:ss').format('HH:mm:ss');
      this.infoSensorTemperaturaAr = informacoes;
      this.carregarGraficoLine();
    }, error => {
      console.log(error.error);
    });
  }

  setarDataFiltro(valor: any) {
    const dataStart = (valor.dataInicial) ? valor.dataInicial : valor.dataInicial;
    const dataEnd = (valor.dataFinal) ? valor.dataFinal : valor.dataFinal;
    this.dataPeriodo = Object.assign(
      {
        dataInicial: dataStart,
        dataFinal: dataEnd
      }
    );
  }

}
