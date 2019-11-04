import { Injectable, EventEmitter } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { HttpClient } from '@angular/common/http';
import { Permissao } from 'src/app/_models/Permissoes/permissao';
import { Observable } from 'rxjs';
import { PermissaoAcoes } from 'src/app/_models/Permissoes/permissaoAcoes';
import { PermissaoObjetos } from 'src/app/_models/Permissoes/permissaoObjetos';

@Injectable({
  providedIn: 'root'
})
export class PermissaoService {

  private jwtHelper = new JwtHelperService();
  private token = localStorage.getItem('token');
  private decodedToken = this.jwtHelper.decodeToken(this.token);

  baseURL = InfoAPI.URL + '/permissoes';

  retornoAutorizacao: any;

  atualizaObjetos = new EventEmitter<boolean>();

  constructor(private http: HttpClient) {
  }

  atualizarObjetos() {
    this.atualizaObjetos.emit(true);
  }

  getPermissaoFormularios(): Observable<Permissao[]> {
    return this.http.get<Permissao[]>(`${this.baseURL}/formularios`);
  }

  getPermissaoFormulariosByNivelId(nivelId = null): Observable<Permissao[]> {
    const usuarioNivelId = (nivelId === null) ? this.getUsuarioNiveis()[1] : nivelId;
    return this.http.get<Permissao[]>(`${this.baseURL}/formularios/${usuarioNivelId}`);
  }

  getPermissaoAcoesByFormularioAndObjeto(permissao: Permissao): Observable<PermissaoAcoes[]> {
    return this.http.post<PermissaoAcoes[]>(`${this.baseURL}/acoes`, permissao);
  }

  getPermissaoObjetosByFormularioAndNivelId(permissao: Permissao, nivelId = null): Observable<PermissaoObjetos[]> {
    const usuarioNivelId = (nivelId === null) ? this.getUsuarioNiveis()[1] : nivelId;
    return this.http.post<PermissaoObjetos[]>(`${this.baseURL}/objetos/${usuarioNivelId}`, permissao);
  }

  getPermissaoAcoesByNivelId(nivelId = null): Observable<PermissaoAcoes[]> {
    const usuarioNivelId = (nivelId === null) ? this.getUsuarioNiveis()[1] : nivelId;
    return this.http.get<PermissaoAcoes[]>(`${this.baseURL}/objetos/acoes/${usuarioNivelId}`);
  }

  getPermissoesByFormulario(permissao: Permissao): Observable<Permissao[]> {
    return this.http.post<Permissao[]>(`${this.baseURL}/formulario`, permissao);
  }

  cadastrarPermissaoObjeto(permissaoObjeto: PermissaoObjetos) {
    return this.http.post(`${this.baseURL}/objeto/cadastrar`, permissaoObjeto);
  }

  cadastrarPermissaoFormulario(permissao: Permissao) {
    return this.http.post(`${this.baseURL}/cadastrar`, permissao);
  }

  editarPermissaoObjeto(permissaoObjeto: PermissaoObjetos) {
    return this.http.put(`${this.baseURL}/objeto/editar/${permissaoObjeto.id}`, permissaoObjeto);
  }

  editarPermissaoObjetos(permissaoObjetos: PermissaoObjetos[]) {
    return this.http.put(`${this.baseURL}/objetos/editar`, permissaoObjetos);
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

  getUrlUsuarioLogadoFotoPerfil(usuarioId = null, nomeArquivo = null): string {
    const usuarioNivelId = (usuarioId === null) ? this.getUsuarioNiveis()[1] : usuarioId;
    const nomeArquivoFotoPerfil = (nomeArquivo === null) ? localStorage.getItem('nomeArquivoFotoPerfil') : nomeArquivo;
    if (nomeArquivoFotoPerfil !== 'null' && nomeArquivoFotoPerfil && nomeArquivoFotoPerfil !== '') {
      return InfoAPI.URL + '/usuarios/' + usuarioNivelId + '/Perfil/' + nomeArquivoFotoPerfil;
    } else {
      return './../assets/img/user-default.png';
    }
  }

  getUsuarioNiveis() {
    this.token = localStorage.getItem('token');
    this.decodedToken = this.jwtHelper.decodeToken(this.token);
    return (this.decodedToken) ? this.decodedToken.role : [0];
  }

  private filtrarPermissaoObjetoAcoes(objetos: PermissaoObjetos[], objeto: string): PermissaoAcoes[] {
    if (objetos !== null) {
      const objetoFiltrado = objetos.filter(c => c.objeto === objeto);
      if (objetoFiltrado.length > 0) {
        const acoes = objetoFiltrado[0].permissaoAcoes;
        return acoes;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  verificarPermissaoPorObjetos(objetos: PermissaoObjetos[], objeto: string): PermissaoAcoes {
    const acoes = this.filtrarPermissaoObjetoAcoes(objetos, objeto);
    if (acoes.length > 0) {
      return acoes[0];
    } else {
      return null;
    }
  }
}
