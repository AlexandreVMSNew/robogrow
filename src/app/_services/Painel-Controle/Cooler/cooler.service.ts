import { Injectable } from '@angular/core';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cooler } from 'src/app/_models/Painel-Controle/Cooler/Cooler';

@Injectable({
  providedIn: 'root'
})
export class CoolerService {

  baseURL = InfoAPI.URL + '/painel-controle/coolers';

  constructor(private http: HttpClient) {}

  getCoolers(): Observable<Cooler[]> {
    return this.http.get<Cooler[]>(`${this.baseURL}`);
  }

  editarCooler(cooler: Cooler) {
    return this.http.put(`${this.baseURL}/editar/${cooler.id}`, cooler);
  }

}
