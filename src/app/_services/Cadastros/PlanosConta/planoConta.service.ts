import { Injectable } from '@angular/core';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlanoContas } from 'src/app/_models/Cadastros/PlanoContas/planoContas';

@Injectable({
  providedIn: 'root'
})
export class PlanoContaService {

  baseURL = InfoAPI.URL + '/planoconta';
  constructor(private http: HttpClient) { }

  getPlanosConta(): Observable<PlanoContas[]> {
    return this.http.get<PlanoContas[]>(this.baseURL);
  }

  getPlanoContasById(id: number): Observable<PlanoContas> {
    return this.http.get<PlanoContas>(`${this.baseURL}/${id}`);
  }

  getPlanoContasFilhosById(id: number): Observable<PlanoContas> {
    return this.http.get<PlanoContas>(`${this.baseURL}/${id}/filhos`);
  }

  novoPlanoConta(planoConta: PlanoContas) {
    return this.http.post(`${this.baseURL}/novo`, planoConta);
  }

  editarPlanoConta(planoConta: PlanoContas) {
    return this.http.put(`${this.baseURL}/editar/${planoConta.id}`, planoConta);
  }

  editarPlanoContaFilhos(superiorId, planoConta: PlanoContas[]) {
    return this.http.put(`${this.baseURL}/editar/${superiorId}/filhos`, planoConta);
  }
}
