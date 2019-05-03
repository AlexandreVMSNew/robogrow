import { Injectable } from '@angular/core';
import { Colaborador } from '../_models/Colaborador';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ColaboradorOcorrencia } from '../_models/ColaboradorOcorrencia';

@Injectable({
  providedIn: 'root'
})
export class ColaboradorService {
  baseURL = 'http://localhost:5000/api/colaboradores';
constructor(private http: HttpClient) { }

getAllColaborador(): Observable<Colaborador[]> {
  return this.http.get<Colaborador[]>(this.baseURL);
}

getColaboradorByName(name: string): Observable<Colaborador[]> {
  return this.http.get<Colaborador[]>(`${this.baseURL}/getByName/${name}`);
}
getColaboradorById(id: number): Observable<Colaborador> {
  return this.http.get<Colaborador>(`${this.baseURL}/${id}`);
}

novoColaborador(colaborador: Colaborador) {
  return this.http.post(`${this.baseURL}/novo`, colaborador);
}

editarColaborador(colaborador: Colaborador) {
  return this.http.put(`${this.baseURL}/editar/${colaborador.id}`, colaborador);
}

deletarColaborador(id: number) {
  return this.http.delete(`${this.baseURL}/${id}`);
}

}
