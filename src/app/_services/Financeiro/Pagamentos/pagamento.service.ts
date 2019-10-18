import { Injectable } from '@angular/core';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { Pagamentos } from 'src/app/_models/Financeiro/Pagamentos/Pagamentos';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PagamentoParcelas } from 'src/app/_models/Financeiro/Pagamentos/PagamentoParcelas';

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {

  baseURL = InfoAPI.URL + '/api/pagamentos';
  detalharPagamento = false;
  templatePagamento = false;

  constructor(private http: HttpClient) { }

  getDetalharPagamentoStatus() {
    return this.detalharPagamento;
  }
  setDetalharPagamentoStatus(val: boolean) {
    this.detalharPagamento = val;
  }

  getTemplatePagamentoStatus() {
    return this.templatePagamento;
  }
  setTemplatePagamentoStatus(val: boolean) {
    this.templatePagamento = val;
  }

  getPagamentos(): Observable<Pagamentos[]> {
    return this.http.get<Pagamentos[]>(this.baseURL);
  }
  getPagamentosById(id: number): Observable<Pagamentos> {
    return this.http.get<Pagamentos>(`${this.baseURL}/${id}`);
  }
  novoPagamento(pagamento: Pagamentos) {
    return this.http.post(`${this.baseURL}/novo`, pagamento);
  }
  editarPagamento(pagamento: Pagamentos) {
    return this.http.put(`${this.baseURL}/editar/${pagamento.id}`, pagamento);
  }
  novoPagamentoParcelas(pagamentoParcelas: PagamentoParcelas[]) {
    return this.http.post(`${this.baseURL}/parcelas/novo`, pagamentoParcelas);
  }

  editarPagamentoParcelas(pagamentoParcelas: PagamentoParcelas[]) {
    return this.http.put(`${this.baseURL}/parcelas/editar/`, pagamentoParcelas);
  }
}
