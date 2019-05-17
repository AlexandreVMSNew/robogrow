import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClienteGrupos } from './../../../_models/Cadastros/Clientes/ClienteGrupos';
import { Cliente } from './../../../_models/Cadastros/Clientes/Cliente';
import { InfoAPI } from './../../../_models/Info/infoAPI';

@Injectable({
  providedIn: 'root'
})
export class GrupoClienteService {

  baseURL = InfoAPI.URL + '/api/grupocliente';
constructor(private http: HttpClient) { }
  getAllGrupos(): Observable<ClienteGrupos[]> {
    return this.http.get<ClienteGrupos[]>(`${this.baseURL}/grupos`);
  }

  getClientesByGrupoId(GrupoId: number): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.baseURL}/clientes/grupo/${GrupoId}`);
  }

  novoGrupo(grupo: ClienteGrupos) {
    return this.http.post(`${this.baseURL}/novo`, grupo);
  }
}
