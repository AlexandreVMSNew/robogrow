import { Injectable, EventEmitter } from '@angular/core';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { Observable } from 'rxjs';
import { Autorizacao } from 'src/app/_models/Autorizacoes/Autorizacao';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AutorizacaoService {

  baseURL = InfoAPI.URL + '/autorizacoes';

  atualizaAutorizacoes = new EventEmitter<boolean>();

  constructor(private http: HttpClient) { }

  atualizarAutorizacoes() {
    this.atualizaAutorizacoes.emit(true);
  }

  getAutorizacoes(): Observable<Autorizacao[]> {
    return this.http.get<Autorizacao[]>(this.baseURL);
  }

  getAutorizacaoById(id: number): Observable<Autorizacao> {
    return this.http.get<Autorizacao>(`${this.baseURL}/${id}`);
  }

  getAutorizacaoFormularioById(id: number): Observable<Autorizacao[]> {
    return this.http.get<Autorizacao[]>(`${this.baseURL}/formulario/${id}`);
  }

  novaAutorizacao(autorizacao: Autorizacao) {
    return this.http.post(`${this.baseURL}/cadastrar`, autorizacao);
  }

  editarAutorizacao(autorizacao: Autorizacao) {
    return this.http.put(`${this.baseURL}/editar/${autorizacao.id}`, autorizacao);
  }
}
