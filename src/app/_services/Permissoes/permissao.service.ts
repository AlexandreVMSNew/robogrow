import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class PermissaoService {


  private jwtHelper = new JwtHelperService();
  private token = localStorage.getItem('token');
  private decodedToken = this.jwtHelper.decodeToken(this.token);
constructor() {
 }


getUsuarioId() {
  this.token = localStorage.getItem('token');
  this.decodedToken = this.jwtHelper.decodeToken(this.token);
  return this.decodedToken.nameid;
}

getUsuario() {
  this.token = localStorage.getItem('token');
  this.decodedToken = this.jwtHelper.decodeToken(this.token);
  return this.decodedToken.unique_name;
}

getUsuarioNiveis() {
  this.token = localStorage.getItem('token');
  this.decodedToken = this.jwtHelper.decodeToken(this.token);
  return this.decodedToken.role;
}

verificaPermissao(niveis: any) {
  this.token = localStorage.getItem('token');
  this.decodedToken = this.jwtHelper.decodeToken(this.token);

  let retorno = false;
  niveis.forEach((nivel: any) => {
    if (this.getUsuarioNiveis().indexOf(nivel) !== -1) {
      retorno = true;
    }
  });
  return retorno;
}

}
