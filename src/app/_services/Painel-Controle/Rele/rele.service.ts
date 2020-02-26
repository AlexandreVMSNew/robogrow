import { Injectable, EventEmitter } from '@angular/core';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rele } from 'src/app/_models/Painel-Controle/Rele/Rele';

@Injectable({
  providedIn: 'root'
})
export class ReleService {

  baseURL = InfoAPI.URL + '/painel-controle/reles';

  atualizaReles = new EventEmitter<Rele[]>();

  constructor(private http: HttpClient) {}

  atualizarReles(reles: Rele[]) {
    this.atualizaReles.emit(reles);
  }

  buscarReles(): Observable<Rele[]> {
    return this.http.get<Rele[]>(`${this.baseURL}`);
  }

  editarRele(rele: Rele): Observable<Rele[]> {
    return this.http.put<Rele[]>(`${this.baseURL}/editar/${rele.id}`, rele);
  }

  cadastrarRele(rele: Rele): Observable<Rele[]> {
    return this.http.post<Rele[]>(`${this.baseURL}/cadastrar`, rele);
  }
}
