import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sistema } from '../_models/sistema';
import { HttpClient } from '@angular/common/http';
import { Geracao } from '../_models/geracao';
import { Versao } from '../_models/Versao';
import { ClienteVersoes } from '../_models/ClienteVersoes';

@Injectable({
  providedIn: 'root'
})
export class SistemaClienteService {
  baseURL = 'http://localhost:5000/api/sistemaclientes';
  constructor(private http: HttpClient) { }

  getAllSistema(): Observable<Sistema[]> {
    return this.http.get<Sistema[]>(`${this.baseURL}/sistemas`);
  }

  getAllGeracao(SistemasId: number): Observable<Geracao[]> {
    return this.http.get<Geracao[]>(`${this.baseURL}/geracoes/${SistemasId}`);
  }

  getAllClienteVersoes(ClienteId: number): Observable<ClienteVersoes[]> {
    return this.http.get<ClienteVersoes[]>(`${this.baseURL}/cliente/versoes/${ClienteId}`);
  }

  getAllGeracaoVersoes(GeracaoId: number): Observable<Versao[]> {
    return this.http.get<Versao[]>(`${this.baseURL}/geracao/versoes/${GeracaoId}`);
  }

}
