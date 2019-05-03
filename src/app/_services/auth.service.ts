import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseURL = 'http://localhost:5000/api/colaboradores/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;

  constructor(private http: HttpClient) { }

  login(model: any) {
    return this.http
      .post(`${this.baseURL}login`, model).pipe(
        map((response: any) => {
          const colaborador = response;
          if (colaborador) {
            localStorage.setItem('token', colaborador.token);
            console.log(colaborador.token);
            this.decodedToken = this.jwtHelper.decodeToken(colaborador.token);
            sessionStorage.setItem('colaboradorNome', this.decodedToken.unique_name);
          }
        })
      );
  }

  loggerIn() {
    const token = localStorage.getItem('token');
    if (token !== null && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    } else {
      return false;
    }
  }

}
