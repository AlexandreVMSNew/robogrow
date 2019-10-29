import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { FormaPagamento } from 'src/app/_models/Cadastros/FormaPagamento/FormaPagamento';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormaPagamentoService {

  baseURL = InfoAPI.URL + '/formapagamento';
  constructor(private http: HttpClient) { }

  getFormaPagamento(): Observable<FormaPagamento[]> {
    return this.http.get<FormaPagamento[]>(this.baseURL);
  }

  getFormaPagamentoById(id: number): Observable<FormaPagamento> {
    return this.http.get<FormaPagamento>(`${this.baseURL}/${id}`);
  }
  cadastrarFormaPagamento(formaPagamento: FormaPagamento) {
    return this.http.post(`${this.baseURL}/cadastrar`, formaPagamento);
  }

  editarFormaPagamento(formaPagamento: FormaPagamento) {
    return this.http.put(`${this.baseURL}/editar/${formaPagamento.id}`, formaPagamento);
  }
}
