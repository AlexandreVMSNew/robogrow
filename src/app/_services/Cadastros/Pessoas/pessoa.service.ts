import { Injectable } from '@angular/core';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { HttpClient } from '@angular/common/http';
import { Pessoa } from 'src/app/_models/Cadastros/Pessoas/Pessoa';
import { Observable } from 'rxjs';
import { TiposPessoa } from 'src/app/_models/Cadastros/Pessoas/TiposPessoa';

@Injectable({
  providedIn: 'root'
})
export class PessoaService {
  baseURL = InfoAPI.URL + '/api/pessoas';
  constructor(private http: HttpClient) { }

  getAllPessoa(): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>(this.baseURL);
  }

  getAllTiposPessoa(): Observable<TiposPessoa[]> {
    return this.http.get<TiposPessoa[]>(`${this.baseURL}/tipos`);
  }

  getPessoaByNome(nome: string): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>(`${this.baseURL}/getByNome/${nome}`);
  }
  getPessoaById(id: number): Observable<Pessoa> {
    return this.http.get<Pessoa>(`${this.baseURL}/${id}`);
  }

  getIdUltimaPessoa(): Observable<Pessoa> {
    return this.http.get<Pessoa>(`${this.baseURL}/idUltimaPessoa`);
  }

  novoPessoa(pessoa: Pessoa) {
    return this.http.post(`${this.baseURL}/novo`, pessoa);
  }

  editarPessoa(pessoa: Pessoa) {
    return this.http.put(`${this.baseURL}/editar/${pessoa.id}`, pessoa);
  }

  excluirPessoa(id: number) {
    return this.http.delete(`${this.baseURL}/excluir/${id}`);
  }

}
