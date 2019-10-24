import { Injectable } from '@angular/core';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { HttpClient } from '@angular/common/http';
import { CentroDespesa } from 'src/app/_models/Cadastros/CentroDespesa/CentroDespesa';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CentroDespesaService {

  baseURL = InfoAPI.URL + '/centrodespesa';
  constructor(private http: HttpClient) { }

  getCentroDespesa(): Observable<CentroDespesa[]> {
    return this.http.get<CentroDespesa[]>(this.baseURL);
  }

  getCentroDespesaById(id: number): Observable<CentroDespesa> {
    return this.http.get<CentroDespesa>(`${this.baseURL}/${id}`);
  }
  novoCentroDespesa(centroDespesa: CentroDespesa) {
    return this.http.post(`${this.baseURL}/novo`, centroDespesa);
  }

  editarCentroDespesa(centroDespesa: CentroDespesa) {
    return this.http.put(`${this.baseURL}/editar/${centroDespesa.id}`, centroDespesa);
  }
}
