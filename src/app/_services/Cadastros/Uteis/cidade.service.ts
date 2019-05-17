import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cidade } from 'src/app/_models/Cadastros/Uteis/Cidade';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';

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
