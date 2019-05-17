import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Retorno } from './../../../_models/Atendimentos/Retornos/retorno';
import { RetornoLog } from './../../../_models/Atendimentos/Retornos/retornoLog';
import { InfoAPI } from './../../../_models/Info/infoAPI';

@Injectable({
  providedIn: 'root'
})
export class RetornoService {

  baseURL = InfoAPI.URL + '/api/atendimentos/retornos';
  constructor(private http: HttpClient) { }

getAllRetornos(): Observable<Retorno[]> {
  return this.http.get<Retorno[]>(this.baseURL);
}

getRetornoByClienteId(clienteId: number): Observable<Retorno[]> {
  return this.http.get<Retorno[]>(`${this.baseURL}/cliente/${clienteId}`);
}

getAllLogsByRetornoId(retornoId: number): Observable<RetornoLog[]> {
  return this.http.get<RetornoLog[]>(`${this.baseURL}/logs/${retornoId}`);
}

novoRetorno(retorno: Retorno) {
  return this.http.post(`${this.baseURL}/novo`, retorno);
}

novoLog(retornoLog: RetornoLog) {
  return this.http.post(`${this.baseURL}/logs`, retornoLog);
}

editarRetorno(retorno: Retorno) {
  return this.http.put(`${this.baseURL}/editar/${retorno.id}`, retorno);
}

deletarRetorno(id: number) {
  return this.http.delete(`${this.baseURL}/${id}`);
}
}
