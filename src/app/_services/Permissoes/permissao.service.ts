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
  baseURL = InfoAPI.URL + '/permissoes';

  retornoAutorizacao: any;
  constructor(private http: HttpClient) {
  }

  getPermissoesByFormularioAcaoObjeto(permissao: Permissao): Observable<Permissao> {
    return this.http.post<Permissao>(`${this.baseURL}/formulario/acao/objeto`, permissao);
  }

  getPermissoesByFormulario(permissao: Permissao): Observable<Permissao[]> {
    return this.http.post<Permissao[]>(`${this.baseURL}/formulario`, permissao);
  }

  getPermissoesByAcao(permissao: Permissao): Observable<Permissao[]> {
    return this.http.post<Permissao[]>(`${this.baseURL}/acao`, permissao);
  }

  getPermissoes(): Observable<Permissao[]> {
    return this.http.get<Permissao[]>(`${this.baseURL}`);
  }

  editarNiveisPermissoes(formulario: string, permissaoNivel: PermissaoNivel[]): Observable<PermissaoNivel[]> {
    return this.http.put<PermissaoNivel[]>(`${this.baseURL}/editar/${formulario}`, permissaoNivel);
  }

  getUsuarioId(): number {
    this.token = localStorage.getItem('token');
    this.decodedToken = this.jwtHelper.decodeToken(this.token);
    return (this.decodedToken) ? Number(this.decodedToken.nameid) : null;
  }

  getUsuario()  {
    this.token = localStorage.getItem('token');
    this.decodedToken = this.jwtHelper.decodeToken(this.token);
    return (this.decodedToken) ? this.decodedToken.unique_name : '';
  }

  getUrlUsuarioLogadoFotoPerfil(): string {
    const nomeArquivoFotoPerfil = localStorage.getItem('nomeArquivoFotoPerfil');
    if (nomeArquivoFotoPerfil !== 'null' && nomeArquivoFotoPerfil) {
      return InfoAPI.URL + '/usuarios/' + this.decodedToken.nameid + '/Perfil/' + nomeArquivoFotoPerfil;
    } else {
      return './../assets/img/user-default.png';
    }
  }

  getUsuarioNiveis() {
    this.token = localStorage.getItem('token');
    this.decodedToken = this.jwtHelper.decodeToken(this.token);
    return (this.decodedToken) ? this.decodedToken.role : [];
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
