import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { Recebimentos } from 'src/app/_models/Financeiro/Recebimentos/Recebimentos';
import { Observable } from 'rxjs';
import { RecebimentoParcelas } from 'src/app/_models/Financeiro/Recebimentos/RecebimentoParcelas';

@Injectable({
  providedIn: 'root'
})
export class RecebimentoService {

  baseURL = InfoAPI.URL + '/recebimentos';
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

  getRecebimentos(): Observable<Recebimentos[]> {
    return this.http.get<Recebimentos[]>(this.baseURL);
  }
  getRecebimentosById(id: number): Observable<Recebimentos> {
    return this.http.get<Recebimentos>(`${this.baseURL}/${id}`);
  }
  cadastrarRecebimentos(recebimentos: Recebimentos) {
    return this.http.post(`${this.baseURL}/cadastrar`, recebimentos);
  }
  cadastrarRecebimentoParcelas(recebimentoParcelas: RecebimentoParcelas[]) {
    return this.http.post(`${this.baseURL}/parcelas/cadastrar`, recebimentoParcelas);
  }
  editarRecebimentos(recebimentos: Recebimentos) {
    return this.http.put(`${this.baseURL}/editar/${recebimentos.id}`, recebimentos);
  }

  editarRecebimentoParcelas(recebimentoParcelas: RecebimentoParcelas[]) {
    return this.http.put(`${this.baseURL}/parcelas/editar/`, recebimentoParcelas);
  }


}
