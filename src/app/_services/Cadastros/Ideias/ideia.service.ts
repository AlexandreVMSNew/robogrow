import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { Observable } from 'rxjs';
import { Ideia } from 'src/app/_models/Cadastros/Ideias/ideia';

@Injectable({
  providedIn: 'root'
})
export class IdeiaService {

  baseURL = InfoAPI.URL + '/ideias';

  constructor(private http: HttpClient) {}

getIdeias(): Observable<Ideia[]> {
  return this.http.get<Ideia[]>(`${this.baseURL}`);
}

getIdeiasByUsuarioId(usuarioId: number): Observable<Ideia[]> {
  return this.http.get<Ideia[]>(`${this.baseURL}/${usuarioId}`);
}

novaIdeia(ideia: Ideia) {
  return this.http.post(`${this.baseURL}/novo`, ideia);
}


}
