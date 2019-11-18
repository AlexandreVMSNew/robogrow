import { Component, OnInit, Input } from '@angular/core';
import { Tarefa } from '../_models/Tarefas/Tarefa';
import { TarefaService } from '../_services/Tarefas/tarefa.service';
import { PermissaoService } from '../_services/Permissoes/permissao.service';
import { DataPeriodo } from '../_models/Cadastros/Uteis/DataPeriodo';

@Component({
  selector: 'app-tarefas',
  templateUrl: './tarefas.component.html',
  styleUrls: ['./tarefas.component.css']
})
export class TarefasComponent implements OnInit {

  @Input() tarefas: Tarefa[];

  dataPeriodo: DataPeriodo;

  usuarioLogadoId: number;
  usuarioLogadoNivel: number;

  constructor(private tarefaService: TarefaService,
              private permissaoService: PermissaoService) { }

  ngOnInit() {
    this.usuarioLogadoId = this.permissaoService.getUsuarioId();
    this.usuarioLogadoNivel = this.permissaoService.getUsuarioNiveis()[1];
  }

  getTarefas() {
    this.tarefaService.getTarefasByUsuarioIdAndNivelId(this.usuarioLogadoId, this.usuarioLogadoNivel).subscribe
    ((_TAREFAS: Tarefa[]) => {
      this.tarefas = [] = _TAREFAS;
    }, error => {
      console.log(error.error);
    });
  }

}
