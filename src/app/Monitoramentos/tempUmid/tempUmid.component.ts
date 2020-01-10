import { Component, OnInit } from '@angular/core';
import { TempUmidService } from 'src/app/_services/Monitoramentos/tempUmid.service';
import { TempUmid } from 'src/app/_models/Monitoramentos/TempUmid/TempUmid';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { DataService } from 'src/app/_services/Cadastros/Uteis/data.service';

@Component({
  selector: 'app-temp-umid',
  templateUrl: './tempUmid.component.html',
  styleUrls: ['./tempUmid.component.css']
})
export class TempUmidComponent implements OnInit {

  tempUmid: TempUmid[] = [];

  lineChartData: ChartDataSets[];
  lineChartLabels: Label[];

  constructor(private tempUmidService: TempUmidService,
              private dataService: DataService) { }

  ngOnInit() {
    this.getTempUmid();
  }

  carregarGraficoLine() {
    const umidades = [];
    const temperaturas = [];
    const sensacaoTermicas = [];
    const momentos = [];
    this.tempUmid.forEach((info: TempUmid) => {
      umidades.push(info.umidade);
      temperaturas.push(info.temperatura);
      sensacaoTermicas.push(info.sensacaoTemperatura);
      momentos.push(this.dataService.getDataHoraPTBR(info.dataHora));
    });

    this.lineChartData =  [
      { data: umidades, label: 'Umidade' },
      { data: temperaturas, label: 'Temperatura' },
      { data: sensacaoTermicas, label: 'Sensação Térmica' }
    ];

    this.lineChartLabels = momentos;
  }

  getTempUmid() {
    this.tempUmidService.getTempUmid().subscribe((_TEMPUMID: TempUmid[]) => {
      this.tempUmid = _TEMPUMID;
      console.log(this.tempUmid);
      this.carregarGraficoLine();
    }, error => {
      console.log(error.error);
    });
  }

}
