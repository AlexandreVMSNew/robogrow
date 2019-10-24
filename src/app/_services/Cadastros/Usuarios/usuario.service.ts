import { Injectable } from '@angular/core';
import { Usuario } from '../../../_models/Cadastros/Usuarios/Usuario';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Nivel } from '../../../_models/Cadastros/Usuarios/Nivel';
import { InfoAPI } from '../../../_models/Info/infoAPI';
import { UsuarioSenha } from 'src/app/_models/Cadastros/Usuarios/UsuarioSenha';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  baseURL = InfoAPI.URL + '/usuarios';
  retornoPermissao = false;
constructor(private http: HttpClient) { }

getUsuarios(): Observable<Usuario[]> {
  return this.http.get<Usuario[]>(this.baseURL);
}

getUsuarioById(id: number): Observable<Usuario> {
  return this.http.get<Usuario>(`${this.baseURL}/${id}`);
}

getNiveis(): Observable<Nivel[]> {
  return this.http.get<Nivel[]>(`${this.baseURL}/niveis`);
}

getIdUltimoUsuario(): Observable<Usuario> {
  return this.http.get<Usuario>(`${this.baseURL}/idultimousuario`);
}

getUrlUsuarioFotoPerfil(usuarioId: number, nomeArquivoFotoPerfil: string): string {
  if (nomeArquivoFotoPerfil !== 'null' && nomeArquivoFotoPerfil) {
    return InfoAPI.URL + '/usuarios/' + usuarioId + '/perfil/' + nomeArquivoFotoPerfil;
  } else {
    return './../assets/img/user-default.png';
  }
}

enviarFotoPerfil(usuarioId: number, arquivo: File, nomeArquivo) {
  const formData = new FormData();
  formData.append('arquivo', arquivo, nomeArquivo);
  return this.http.post(`${this.baseURL}/uploadfotoperfil/${usuarioId}`, formData);
}

novoUsuario(usuario: Usuario) {
  return this.http.post(`${this.baseURL}/novo`, usuario);
}

editarUsuario(usuario: Usuario) {
  return this.http.put(`${this.baseURL}/editar/${usuario.id}`, usuario);
}

editarSenhaUsuario(usuarioId: number, senhas: UsuarioSenha) {
  return this.http.put(`${this.baseURL}/editarSenha/${usuarioId}`, senhas);
}

deletarUsuario(id: number) {
  return this.http.delete(`${this.baseURL}/${id}`);
}

}
