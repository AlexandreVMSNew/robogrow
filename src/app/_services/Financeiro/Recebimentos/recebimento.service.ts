import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { Recebimentos } from 'src/app/_models/Financeiro/Recebimentos/Recebimentos';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecebimentoService {

  baseURL = InfoAPI.URL + '/api/recebimentos';
  detalharRecebimento = false;
  templateRecebimento = false;
  constructor(private http: HttpClient) { }

  getDetalharRecebimentoStatus() {
    return this.detalharRecebimento;
  }
  setDetalharRecebimentoStatus(val: boolean) {
    this.detalharRecebimento = val;
  }

  getTemplateRecebimentoStatus() {
    return this.templateRecebimento;
  }
  setTemplateRecebimentoStatus(val: boolean) {
    this.templateRecebimento = val;
  }

  getAllRecebimentos(): Observable<Recebimentos[]> {
    return this.http.get<Recebimentos[]>(this.baseURL);
  }
  getRecebimentosById(id: number): Observable<Recebimentos> {
    return this.http.get<Recebimentos>(`${this.baseURL}/${id}`);
  }
  novoRecebimentos(recebimentos: Recebimentos) {
    return this.http.post(`${this.baseURL}/novo`, recebimentos);
  }
  editarRecebimentos(recebimentos: Recebimentos) {
    return this.http.put(`${this.baseURL}/editar/${recebimentos.id}`, recebimentos);
  }


}