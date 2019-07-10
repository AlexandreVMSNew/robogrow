import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { HttpClient } from '@angular/common/http';
import { Permissao } from 'src/app/_models/Permissoes/permissao';
import { Observable } from 'rxjs';
import { PermissaoNivel } from 'src/app/_models/Permissoes/permissaoNivel';

@Injectable({
  providedIn: 'root'
})
export class PermissaoService {


  private jwtHelper = new JwtHelperService();
  private token = localStorage.getItem('token');
  private decodedToken = this.jwtHelper.decodeToken(this.token);
  baseURL = InfoAPI.URL + '/api/permissoes';

  retornoAutorizacao: any;
constructor(private http: HttpClient) {
 }

getPermissoesByFormularioAcaoObjeto(formulario: string, acao: string, objeto = 'NULL'): Observable<Permissao> {
  return this.http.get<Permissao>(`${this.baseURL}/${formulario}/${acao}/${objeto}`);
}

getPermissoesByFormulario(formulario: string): Observable<Permissao[]> {
  return this.http.get<Permissao[]>(`${this.baseURL}/${formulario}`);
}

editarNiveisPermissoes(formulario: string, permissaoNivel: PermissaoNivel[]): Observable<PermissaoNivel[]> {
  return this.http.put<PermissaoNivel[]>(`${this.baseURL}/editar/${formulario}`, permissaoNivel);
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

verificarPermissao(_PERMISSAO: any): any {
  let retorno = false;
  _PERMISSAO.permissaoNiveis.forEach(pn => {
    this.getUsuarioNiveis().forEach(nivelUsuario => {
      if (pn.nivelId.toString() === nivelUsuario) {
        retorno = true;
      }
    });
  });
  return retorno;
}
}