import { Injectable } from '@angular/core';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { HttpClient } from '@angular/common/http';
import { Email } from 'src/app/_models/Email/Email';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  baseURL = InfoAPI.URL + '/api/email';


  constructor(private http: HttpClient) { }

enviarEmail(email: Email) {
  return this.http.post(`${this.baseURL}/enviar`, email);
}
}
