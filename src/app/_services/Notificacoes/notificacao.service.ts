import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { Observable } from 'rxjs';
import { Notificacao } from 'src/app/_models/Notificacoes/notificacao';

@Injectable({
  providedIn: 'root'
})
export class NotificacaoService {

  baseURL = InfoAPI.URL + '/api/notificacoes';

  constructor(private http: HttpClient) {}

getNotificacoesByUsuarioId(usuarioId: number): Observable<Notificacao[]> {
  return this.http.get<Notificacao[]>(`${this.baseURL}/usuario/${usuarioId}`);
}

getCountNotificacoesByUsuarioId(usuarioId: number): Observable<number> {
  return this.http.get<number>(`${this.baseURL}/usuario/count/${usuarioId}`);
}

novaNotificacao(notificacao: Notificacao) {
  return this.http.post(`${this.baseURL}/nova`, notificacao);
}

novasNotificacoes(notificacoes: Notificacao[]) {
  return this.http.post(`${this.baseURL}/novas`, notificacoes);
}


editarVistoNotificacao(notificacao: any) {
  return this.http.put(`${this.baseURL}/editar/visto`, notificacao);
}

}
