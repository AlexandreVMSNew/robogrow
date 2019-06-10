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
  baseURL = InfoAPI.URL + '/api/usuarios';
  retornoPermissao = false;
constructor(private http: HttpClient) { }

getAllUsuario(): Observable<Usuario[]> {
  return this.http.get<Usuario[]>(this.baseURL);
}

getUsuarioByName(name: string): Observable<Usuario[]> {
  return this.http.get<Usuario[]>(`${this.baseURL}/getByName/${name}`);
}
getUsuarioById(id: number): Observable<Usuario> {
  return this.http.get<Usuario>(`${this.baseURL}/${id}`);
}

getAllNiveis(): Observable<Nivel[]> {
  return this.http.get<Nivel[]>(`${this.baseURL}/niveis`);
}

getIdUltimoUsuario(): Observable<Usuario> {
  return this.http.get<Usuario>(`${this.baseURL}/idultimousuario`);
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
