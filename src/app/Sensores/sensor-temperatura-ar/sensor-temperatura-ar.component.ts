import { Component, OnInit } from '@angular/core';
import { SensorTemperaturaAr } from 'src/app/_models/Sensores/SensorTemperaturaAr/SensorTemperaturaAr';
import { DataService } from 'src/app/_services/Cadastros/Uteis/data.service';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { SensorTemperaturaArService } from 'src/app/_services/Sensores/SensorTemperaturaAr/SensorTemperaturaAr.service';

@Component({
  selector: 'app-sensor-temperatura-ar',
  templateUrl: './sensor-temperatura-ar.component.html',
  styleUrls: ['./sensor-temperatura-ar.component.css']
})
export class SensorTemperaturaArComponent implements OnInit {

  infoSensorTemperaturaAr: SensorTemperaturaAr[] = [];

  lineChartData: ChartDataSets[];
  lineChartLabels: Label[];

  constructor(private dataService: DataService,
              private sensorTemperaturaArService: SensorTemperaturaArService) { }

  ngOnInit() {
    this.buscarTemperaturaUmidadeAr();
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

  buscarTemperaturaUmidadeAr() {
    this.sensorTemperaturaArService.buscarTemperaturaUmidadeAr().subscribe((informacoes: SensorTemperaturaAr[]) => {
      this.infoSensorTemperaturaAr = informacoes;
      this.carregarGraficoLine();
    }, error => {
      console.log(error.error);
    });
  }

}
