import { Injectable } from '@angular/core';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { HttpClient } from '@angular/common/http';
import { ChequePre } from 'src/app/_models/Cadastros/ChequePre/ChequePre';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChequePreService {

  baseURL = InfoAPI.URL + '/chequepre';
  chequePreTemplate = false;
  constructor(private http: HttpClient) { }

  getChequePreTemplateStatus() {
    return this.chequePreTemplate;
  }
  setChequePreTemplateStatus(val: boolean) {
    this.chequePreTemplate = val;
  }

  getChequePre(): Observable<ChequePre[]> {
    return this.http.get<ChequePre[]>(this.baseURL);
  }

  getChequePreById(id: number): Observable<ChequePre> {
    return this.http.get<ChequePre>(`${this.baseURL}/${id}`);
  }
  cadastrarChequePre(chequepre: ChequePre) {
    return this.http.post(`${this.baseURL}/cadastrar`, chequepre);
  }

  editarChequePre(chequepre: ChequePre) {
    return this.http.put(`${this.baseURL}/editar/${chequepre.id}`, chequepre);
  }

}
