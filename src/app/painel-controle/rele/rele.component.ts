import { Component, OnInit } from '@angular/core';
import { Rele } from 'src/app/_models/Painel-Controle/Rele/Rele';
import { TemplateModalService } from 'src/app/_services/Uteis/TemplateModal/templateModal.service';
import { ReleManutencaoComponent } from './rele-manutencao/rele-manutencao.component';
import { ReleService } from 'src/app/_services/Painel-Controle/Rele/rele.service';

@Component({
  selector: 'app-rele',
  templateUrl: './rele.component.html',
  styleUrls: ['./rele.component.css']
})
export class ReleComponent implements OnInit {

  reles: Rele[];

  templateModalReleManutencaoService = new TemplateModalService();
  releManutencaoComponent = ReleManutencaoComponent;
  inputs: any;
  tituloModal = '';
  componentModal: any;

  constructor(private releService: ReleService) {
    this.releService.atualizaReles.subscribe((reles: Rele[]) => {
      this.reles = reles;
    }, error => {
      console.log(error);
    });
   }

  ngOnInit() {
    this.buscarReles();
  }

  abrirReleManutencao(releInput: Rele) {
    this.tituloModal =  `Rele Cadastro`;
    this.componentModal = this.releManutencaoComponent;
    this.inputs = Object.assign({rele: releInput});
    this.templateModalReleManutencaoService.setTemplateModalStatus(true);
  }
  getTemplateModalReleManutencao() {
    return this.templateModalReleManutencaoService.getTemplateModalStatus();
  }

  buscarReles() {
    this.releService.buscarReles().subscribe((reles: Rele[]) => {
      this.reles = reles;
      console.log(this.reles);
    }, error => {
      console.log(error.error);
    });
  }

}
