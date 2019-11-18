import { Component, OnInit, Input } from '@angular/core';
import { VendaLogsStatus } from 'src/app/_models/Movimentos/Venda/VendaLogsStatus';

@Component({
  selector: 'app-logs-status-venda',
  templateUrl: './logsStatusVenda.component.html',
  styleUrls: ['./logsStatusVenda.component.css']
})
export class LogsStatusVendaComponent implements OnInit {

  @Input() logs: VendaLogsStatus[];

  constructor() { }

  ngOnInit() {
  }

}
