import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cidade } from '../_models/Cidade';

@Injectable({
  providedIn: 'root'
})
export class CidadeService {
  baseURL = 'http://localhost:5000/api/cidades';
constructor(private http: HttpClient) { }

getAllCidades(): Observable<Cidade[]> {
  return this.http.get<Cidade[]>(this.baseURL);
}

getCidadeByEstadoId(EstadoId: number): Observable<Cidade[]> {
  return this.http.get<Cidade[]>(`${this.baseURL}/${EstadoId}`);
}
}
