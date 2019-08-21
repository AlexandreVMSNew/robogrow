import { Injectable } from '@angular/core';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { HttpClient } from '@angular/common/http';
import { ChequePre } from 'src/app/_models/Cadastros/ChequePre/ChequePre';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChequePreService {

  baseURL = InfoAPI.URL + '/api/chequepre';
  chequePreTemplate = false;
  constructor(private http: HttpClient) { }

  getChequePreTemplateStatus() {
    return this.chequePreTemplate;
  }
  setChequePreTemplateStatus(val: boolean) {
    this.chequePreTemplate = val;
  }

  getAllChequePre(): Observable<ChequePre[]> {
    return this.http.get<ChequePre[]>(this.baseURL);
  }

  getChequePreById(id: number): Observable<ChequePre> {
    return this.http.get<ChequePre>(`${this.baseURL}/${id}`);
  }
  novoChequePre(chequepre: ChequePre) {
    return this.http.post(`${this.baseURL}/novo`, chequepre);
  }

  editarChequePre(chequepre: ChequePre) {
    return this.http.put(`${this.baseURL}/editar/${chequepre.id}`, chequepre);
  }

}
