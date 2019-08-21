import { Injectable } from '@angular/core';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { HttpClient } from '@angular/common/http';
import { CentroReceita } from 'src/app/_models/Cadastros/CentroReceita/CentroReceita';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CentroReceitaService {

  baseURL = InfoAPI.URL + '/api/centroreceita';
  constructor(private http: HttpClient) { }

  getAllCentroReceita(): Observable<CentroReceita[]> {
    return this.http.get<CentroReceita[]>(this.baseURL);
  }

  getCentroReceitaById(id: number): Observable<CentroReceita> {
    return this.http.get<CentroReceita>(`${this.baseURL}/${id}`);
  }
  novoCentroReceita(centroReceita: CentroReceita) {
    return this.http.post(`${this.baseURL}/novo`, centroReceita);
  }

  editarCentroReceita(centroReceita: CentroReceita) {
    return this.http.put(`${this.baseURL}/editar/${centroReceita.id}`, centroReceita);
  }

}
