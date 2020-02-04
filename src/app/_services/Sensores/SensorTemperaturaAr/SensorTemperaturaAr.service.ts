import { Injectable } from '@angular/core';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { Observable } from 'rxjs';
import { SensorTemperaturaAr } from 'src/app/_models/Sensores/SensorTemperaturaAr/SensorTemperaturaAr';
import { HttpClient } from '@angular/common/http';
import { DataPeriodo } from 'src/app/_models/Cadastros/Uteis/DataPeriodo';

@Injectable({
  providedIn: 'root'
})
export class SensorTemperaturaArService {

  baseURL = InfoAPI.URL + '/sensores/temperatura-umidade-ar';

  constructor(private http: HttpClient) {}

  buscarTemperaturaUmidadeAr(dataPeriodo: DataPeriodo): Observable<SensorTemperaturaAr[]> {
    return this.http.post<SensorTemperaturaAr[]>(`${this.baseURL}`, dataPeriodo);
  }

}
