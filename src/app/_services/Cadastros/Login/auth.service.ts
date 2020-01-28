import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { InfoAPI } from './../../../_models/Info/infoAPI';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseURL = InfoAPI.URL + '/usuarios/';
  jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient,
              private router: Router) { }

  login(model: any) {
    return this.http.post(`${this.baseURL}login`, model).pipe(
        map((response: any) => {
          console.log(response);
          const usuario = response;
          if (usuario) {
            localStorage.setItem('token', usuario.token);
            localStorage.setItem('nomeArquivoFotoPerfil', usuario.user.nomeArquivoFotoPerfil);
          }
        }, error => {
          console.log(error);
        })
      );
  }

  logout() {
    if (this.router.url !== '/usuarios/login') {
      localStorage.clear();
      this.router.navigate(['/usuarios/login']);
    }
  }

  loggerIn() {
    const token = localStorage.getItem('token');
    if (token !== null && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    } else {
      this.logout();
      return false;
    }
  }

}
