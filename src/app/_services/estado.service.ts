import { Injectable } from '@angular/core';
import { Colaborador } from '../_models/Colaborador';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../_models/Cliente';
import { Estado } from '../_models/Estado';
@Injectable({
  providedIn: 'root'
})
export class EstadoService {
  baseURL = 'http://localhost:5000/api/estados';
constructor(private http: HttpClient) { }

getAllEstados(): Observable<Estado[]> {
  return this.http.get<Estado[]>(this.baseURL);
}

getEstadoById(EstadoId: number): Observable<Estado> {
  return this.http.get<Estado>(`${this.baseURL}/${EstadoId}`);
}
}
