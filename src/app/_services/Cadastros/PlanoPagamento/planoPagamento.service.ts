import { Injectable } from '@angular/core';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { HttpClient } from '@angular/common/http';
import { PlanoPagamento } from 'src/app/_models/Cadastros/PlanoPagamento/PlanoPagamento';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanoPagamentoService {

baseURL = InfoAPI.URL + '/api/planopagamento';
constructor(private http: HttpClient) { }

getPlanoPagamento(): Observable<PlanoPagamento[]> {
  return this.http.get<PlanoPagamento[]>(this.baseURL);
}

getPlanoPagamentoById(id: number): Observable<PlanoPagamento> {
  return this.http.get<PlanoPagamento>(`${this.baseURL}/${id}`);
}
novoPlanoPagamento(planoPagamento: PlanoPagamento) {
  return this.http.post(`${this.baseURL}/novo`, planoPagamento);
}

editarPlanoPagamento(planoPagamento: PlanoPagamento) {
  return this.http.put(`${this.baseURL}/editar/${planoPagamento.id}`, planoPagamento);
}
}
