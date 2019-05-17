import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cidade } from './../../../_models/Cadastros/Uteis/Cidade';
import { InfoAPI } from './../../../_models/Info/infoAPI';

@Injectable({
  providedIn: 'root'
})
export class CidadeService {
  baseURL = InfoAPI.URL + '/api/cidades';
constructor(private http: HttpClient) { }

getAllCidades(): Observable<Cidade[]> {
  return this.http.get<Cidade[]>(this.baseURL);
}

getCidadeByEstadoId(EstadoId: number): Observable<Cidade[]> {
  return this.http.get<Cidade[]>(`${this.baseURL}/${EstadoId}`);
}
}
