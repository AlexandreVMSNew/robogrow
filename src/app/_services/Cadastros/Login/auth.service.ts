import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { InfoColaborador } from 'src/app/_models/Info/infoColaborador';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseURL = InfoAPI.URL + '/api/colaboradores/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;

  constructor(private http: HttpClient) { }

  setInfoColaborador(decodedToken: any) {
    InfoColaborador.id = decodedToken.nameid;
    InfoColaborador.usuario = decodedToken.unique_name;
    InfoColaborador.niveis = decodedToken.role;
  }
  login(model: any) {
    return this.http.post(`${this.baseURL}login`, model).pipe(
        map((response: any) => {
          const colaborador = response;
          if (colaborador) {
            localStorage.setItem('token', colaborador.token);

            this.decodedToken = this.jwtHelper.decodeToken(colaborador.token);
            this.setInfoColaborador(this.decodedToken);
          }
        })
      );
  }

  loggerIn() {
    const token = localStorage.getItem('token');
    if (token !== null && !this.jwtHelper.isTokenExpired(token)) {
      this.decodedToken = this.jwtHelper.decodeToken(token);
      this.setInfoColaborador(this.decodedToken);
      return true;
    } else {
      return false;
    }
  }

}
