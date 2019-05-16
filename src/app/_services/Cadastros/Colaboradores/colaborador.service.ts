import { Injectable } from '@angular/core';
import { Colaborador } from '../../../_models/Cadastros/Colaboradores/Colaborador';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Nivel } from 'src/app/_models/Cadastros/Colaboradores/Nivel';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';

@Injectable({
  providedIn: 'root'
})
export class ColaboradorService {
  baseURL = InfoAPI.URL + '/api/colaboradores';
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

getAllNiveis(): Observable<Nivel[]> {
  return this.http.get<Nivel[]>(`${this.baseURL}/niveis`);
}

getIdUltimoColaborador(): Observable<Colaborador> {
  return this.http.get<Colaborador>(`${this.baseURL}/idultimocolaborador`);
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
