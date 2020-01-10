import { Component, OnInit } from '@angular/core';
import { Cooler } from 'src/app/_models/Painel-Controle/Cooler/Cooler';
import { CoolerService } from 'src/app/_services/Painel-Controle/Cooler/cooler.service';
import { TemplateModalService } from 'src/app/_services/Uteis/TemplateModal/templateModal.service';
import { CoolerCadastroComponent } from './coolerCadastro/coolerCadastro.component';
import { SocketService } from 'src/app/_services/WebSocket/Socket.service';
import { HttpClient } from '@angular/common/http';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';

@Component({
  selector: 'app-cooler',
  templateUrl: './cooler.component.html',
  styleUrls: ['./cooler.component.css']
})

export class CoolerComponent implements OnInit {

  coolers: Cooler[] = [];

  templateModalCoolerCadastroService = new TemplateModalService();
  coolerCadastroComponent = CoolerCadastroComponent;
  inputs: any;
  tituloModal = '';
  componentModal: any;

  constructor(private coolerService: CoolerService,
              private socketService: SocketService,
              private http: HttpClient) {

   }

  ngOnInit() {
    this.getCoolers();
    this.socketService.iniciarConexao();
    this.socketService.getSocket('coolers');
  }


  abrirCoolerCadastro(coolerInput: Cooler) {
    this.tituloModal =  `Cooler Cadastro`;
    this.componentModal = this.coolerCadastroComponent;
    this.inputs = Object.assign({cooler: coolerInput});
    this.templateModalCoolerCadastroService.setTemplateModalStatus(true);
  }
  getTemplateModalCoolerCadastro() {
    return this.templateModalCoolerCadastroService.getTemplateModalStatus();
  }

  getCoolers() {
    this.coolerService.getCoolers().subscribe((_COOLERS: Cooler[]) => {
      this.coolers = _COOLERS;
    }, error => {
      console.log(error.error);
    });
  }

}
