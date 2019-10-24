import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Retorno } from './../../../_models/Atendimentos/Retornos/retorno';
import { RetornoLog } from './../../../_models/Atendimentos/Retornos/retornoLog';
import { InfoAPI } from './../../../_models/Info/infoAPI';
import { RetornoObservacao } from 'src/app/_models/Atendimentos/Retornos/retornoObservacao';
import { DataPeriodo } from 'src/app/_models/Cadastros/Uteis/DataPeriodo';

@Injectable({
  providedIn: 'root'
})
export class RetornoService {

  baseURL = InfoAPI.URL + '/atendimentos/retornos';
  constructor(private http: HttpClient) { }

getRetornos(): Observable<Retorno[]> {
  return this.http.get<Retorno[]>(this.baseURL);
}

getRetornosNaoFinalizados(): Observable<Retorno[]> {
  return this.http.get<Retorno[]>(`${this.baseURL}/NaoFinalizados`);
}

getRetornosByPeriodo(datas: DataPeriodo): Observable<Retorno[]> {
  return this.http.post<Retorno[]>(`${this.baseURL}/Periodo`, datas);
}

getLogsByRetornoId(retornoId: number): Observable<RetornoLog[]> {
  return this.http.get<RetornoLog[]>(`${this.baseURL}/logs/${retornoId}`);
}

getObservacoesByRetornoId(retornoId: number): Observable<RetornoObservacao[]> {
  return this.http.get<RetornoObservacao[]>(`${this.baseURL}/observacoes/${retornoId}`);
}

getIdUltimoRetorno(): Observable<number> {
  return this.http.get<number>(`${this.baseURL}/ultimoid`);
}

getIdUsuarioUltimoLogByRetornoId(retornoId: number): Observable<number> {
  return this.http.get<number>(`${this.baseURL}/idUsuarioUltimoLog/${retornoId}`);
}

getCountLogsAguardandoByRetornoId(retornoId: number): Observable<number> {
  return this.http.get<number>(`${this.baseURL}/logs/count/${retornoId}`);
}

novoRetorno(retorno: Retorno) {
  return this.http.post(`${this.baseURL}/novo`, retorno);
}

novoLog(retornoLog: RetornoLog) {
  return this.http.post(`${this.baseURL}/logs`, retornoLog);
}

novaObservacao(retornoObservacao: RetornoObservacao) {
  return this.http.post(`${this.baseURL}/novaObservacao`, retornoObservacao);
}

editarRetorno(retorno: Retorno) {
  return this.http.put(`${this.baseURL}/editar/${retorno.id}`, retorno);
}

deletarRetorno(id: number) {
  return this.http.delete(`${this.baseURL}/${id}`);
}
}
