import { Injectable, EventEmitter } from '@angular/core';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Tarefa } from 'src/app/_models/Tarefas/Tarefa';
import { Observable } from 'rxjs';
import { TarefaAnexos } from 'src/app/_models/Tarefas/TarefaAnexos';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {

  baseURL = InfoAPI.URL + '/tarefas';

  atualizaTarefaComentarios = new EventEmitter<number>();

  constructor(private http: HttpClient) { }

  atualizarTarefaComentarios(tarefaId: number) {
    this.atualizaTarefaComentarios.emit(tarefaId);
  }

  novaTarefa(tarefa: Tarefa): Observable<Tarefa>  {
    return this.http.post<Tarefa>(`${this.baseURL}/cadastrar`, tarefa);
  }

  editarTarefa(tarefa: Tarefa): Observable<Tarefa>  {
    return this.http.put<Tarefa>(`${this.baseURL}/editar/${tarefa.id}`, tarefa);
  }

  excluirTarefa(tarefaId: number): Observable<Tarefa>  {
    return this.http.delete<Tarefa>(`${this.baseURL}/excluir/${tarefaId}`);
  }

  getTarefaAnexos(tarefaId: number) {
    return this.http.get(`${this.baseURL}/${tarefaId}/anexos`);
  }

  getTarefas() {
    return this.http.get(`${this.baseURL}/`);
  }

  getTarefasByUsuarioIdAndNivelId(usuarioId, nivelId) {
    return this.http.get(`${this.baseURL}/usuario/${usuarioId}/nivel/${nivelId}`);
  }

  getTarefa(tarefaId: number) {
    return this.http.get(`${this.baseURL}/${tarefaId}`);
  }

  downloadAnexoTarefa(tarefaId: number, tarefaAnexo: TarefaAnexos): Observable<any> {
    return this.http.post(`${this.baseURL}/${tarefaId}/anexo/download`, tarefaAnexo, {
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  enviarAnexosTarefa(tarefaId: number, anexos: File[], nomeAnexos: any) {
    const  formData = new FormData();
    anexos.forEach((anexo: any) => {
      formData.append('anexo', anexo, nomeAnexos[anexos.indexOf(anexo, 0)]);
    });
    return this.http.post(`${this.baseURL}/${tarefaId}/upload/anexos`, formData);
  }

}
