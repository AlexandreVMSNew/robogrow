import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { Observable } from 'rxjs';
import { Notificacao } from 'src/app/_models/Notificacoes/notificacao';
import { DataPeriodo } from 'src/app/_models/Cadastros/Uteis/DataPeriodo';
import { Timeline } from 'src/app/_models/TimeLine/Timeline';

@Injectable({
  providedIn: 'root'
})
export class NotificacaoService {

  baseURL = InfoAPI.URL + '/notificacoes';

  atualizaNotificacoes = new EventEmitter<boolean>();

  constructor(private http: HttpClient) {}


  atualizarNotificacoes() {
    this.atualizaNotificacoes.emit(true);
  }

  getNotificacoesByUsuarioIdMarcado(datas: DataPeriodo, usuarioId: number): Observable<Timeline[]> {
    return this.http.post<Timeline[]>(`${this.baseURL}/usuario-marcado/${usuarioId}`, datas);
  }

  getCountNotificacoesByUsuarioId(usuarioId: number): Observable<number> {
    return this.http.get<number>(`${this.baseURL}/usuario/count/${usuarioId}`);
  }

  cadastrarNotificacao(notificacao: Notificacao) {
    return this.http.post(`${this.baseURL}/cadastrar`, notificacao);
  }

  cadastrarNotificacoes(notificacoes: Notificacao[]) {
    return this.http.post(`${this.baseURL}/cadastrar-muitos`, notificacoes);
  }

  editarVistoNotificacao(notificacao: any) {
    return this.http.put(`${this.baseURL}/editar/visto`, notificacao);
  }

}
