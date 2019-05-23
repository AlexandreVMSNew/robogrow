import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { InfoUsuario } from './../../../_models/Info/infoUsuario';
import { InfoAPI } from './../../../_models/Info/infoAPI';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseURL = InfoAPI.URL + '/api/usuarios/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;

  constructor(private http: HttpClient) { }

  setInfoUsuario(decodedToken: any) {
    InfoUsuario.id = decodedToken.nameid;
    InfoUsuario.usuario = decodedToken.unique_name;
    InfoUsuario.niveis = decodedToken.role;
  }

  login(model: any) {
    return this.http.post(`${this.baseURL}login`, model).pipe(
        map((response: any) => {
          const usuario = response;
          if (usuario) {
            localStorage.setItem('token', usuario.token);

            this.decodedToken = this.jwtHelper.decodeToken(usuario.token);
            this.setInfoUsuario(this.decodedToken);
          }
        })
      );
  }

  loggerIn() {
    const token = localStorage.getItem('token');
    if (token !== null && !this.jwtHelper.isTokenExpired(token)) {
      this.decodedToken = this.jwtHelper.decodeToken(token);
      this.setInfoUsuario(this.decodedToken);
      return true;
    } else {
      return false;
    }
  }

}
