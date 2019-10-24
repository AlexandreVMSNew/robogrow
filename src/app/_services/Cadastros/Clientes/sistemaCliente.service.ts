import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Geracao } from '../../../_models/Cadastros/Sistemas/Geracao';
import { Versao } from '../../../_models/Cadastros/Sistemas/Versao';
import { ClienteVersoes } from '../../../_models/Cadastros/Clientes/ClienteVersoes';
import { InfoAPI } from './../../../_models/Info/infoAPI';
import { Sistema } from 'src/app/_models/Cadastros/Sistemas/Sistema';

@Injectable({
  providedIn: 'root'
})
export class SistemaClienteService {
  baseURL = InfoAPI.URL + '/sistemacliente';
  constructor(private http: HttpClient) { }

  getSistema(): Observable<Sistema[]> {
    return this.http.get<Sistema[]>(`${this.baseURL}/sistemas`);
  }

  getGeracao(SistemasId: number): Observable<Geracao[]> {
    return this.http.get<Geracao[]>(`${this.baseURL}/geracoes/${SistemasId}`);
  }

  getClienteVersoes(ClienteId: number): Observable<ClienteVersoes[]> {
    return this.http.get<ClienteVersoes[]>(`${this.baseURL}/cliente/versoes/${ClienteId}`);
  }

  getGeracaoVersoes(GeracaoId: number): Observable<Versao[]> {
    return this.http.get<Versao[]>(`${this.baseURL}/geracao/versoes/${GeracaoId}`);
  }

}
