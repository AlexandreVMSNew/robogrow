import { Injectable } from '@angular/core';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { Observable } from 'rxjs';
import { SensorTemperaturaAr } from 'src/app/_models/Sensores/SensorTemperaturaAr/SensorTemperaturaAr';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SensorTemperaturaArService {

  baseURL = InfoAPI.URL + '/sensores/temperatura-umidade-ar';

  constructor(private http: HttpClient) {}

  buscarTemperaturaUmidadeAr(): Observable<SensorTemperaturaAr[]> {
    return this.http.get<SensorTemperaturaAr[]>(`${this.baseURL}`);
  }

}
