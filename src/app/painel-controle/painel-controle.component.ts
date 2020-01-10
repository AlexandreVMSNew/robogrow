import { Component, OnInit } from '@angular/core';
import { SocketService } from '../_services/WebSocket/Socket.service';
import { InfoAPI } from '../_models/Info/infoAPI';

@Component({
  selector: 'app-painel-controle',
  templateUrl: './painel-controle.component.html',
  styleUrls: ['./painel-controle.component.css']
})

export class PainelControleComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
