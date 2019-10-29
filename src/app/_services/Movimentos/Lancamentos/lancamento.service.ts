import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { Lancamentos } from 'src/app/_models/Movimentos/Lancamentos/Lancamentos';

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {
  baseURL = InfoAPI.URL + '/movimentos/lancamentos';
  lancamentoTemplate = false;
  constructor(private http: HttpClient) { }

  getLancamentoTemplateStatus() {
    return this.lancamentoTemplate;
  }
  setLancamentoTemplateStatus(val: boolean) {
    this.lancamentoTemplate = val;
  }

  getLancamentos(): Observable<Lancamentos[]> {
    return this.http.get<Lancamentos[]>(this.baseURL);
  }

  getLancamentoById(id: number): Observable<Lancamentos> {
    return this.http.get<Lancamentos>(`${this.baseURL}/${id}`);
  }

  getIdUltimoLancamento(): Observable<Lancamentos> {
    return this.http.get<Lancamentos>(`${this.baseURL}/idUltimoLancamento`);
  }

  cadastrarLancamento(lancamento: Lancamentos) {
    return this.http.post(`${this.baseURL}/cadastrar`, lancamento);
  }

  cadastrarsLancamentos(lancamento: Lancamentos[]) {
    return this.http.post(`${this.baseURL}/cadastrars`, lancamento);
  }


  editarLancamento(lancamento: Lancamentos) {
    return this.http.put(`${this.baseURL}/editar/${lancamento.id}`, lancamento);
  }
}
