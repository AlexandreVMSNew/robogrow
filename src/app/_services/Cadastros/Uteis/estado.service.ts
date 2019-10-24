import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estado } from './../../../_models/Cadastros/Uteis/Estado';
import { InfoAPI } from './../../../_models/Info/infoAPI';
@Injectable({
  providedIn: 'root'
})
export class EstadoService {
  baseURL = InfoAPI.URL + '/estados';
constructor(private http: HttpClient) { }

getEstados(): Observable<Estado[]> {
  return this.http.get<Estado[]>(this.baseURL);
}

getEstadoById(EstadoId: number): Observable<Estado> {
  return this.http.get<Estado>(`${this.baseURL}/${EstadoId}`);
}
}
