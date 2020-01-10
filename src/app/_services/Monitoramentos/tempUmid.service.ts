import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { DataPeriodo } from 'src/app/_models/Cadastros/Uteis/DataPeriodo';
import { Observable } from 'rxjs';
import { TempUmid } from 'src/app/_models/Monitoramentos/TempUmid/TempUmid';

@Injectable({
  providedIn: 'root'
})
export class TempUmidService {

  baseURL = InfoAPI.URL + '/monitoramentos/temp-umid';

  constructor(private http: HttpClient) {}

  getTempUmid(): Observable<TempUmid[]> {
    return this.http.get<TempUmid[]>(`${this.baseURL}`);
  }

}
