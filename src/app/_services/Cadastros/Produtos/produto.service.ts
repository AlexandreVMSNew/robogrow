import { Injectable, EventEmitter } from '@angular/core';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { Produto } from 'src/app/_models/Cadastros/Produtos/produto';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  baseURL = InfoAPI.URL + '/produtos';

  atualizaProdutos = new EventEmitter<boolean>();

  retornoPermissao = false;

  constructor(private http: HttpClient) { }

  atualizarProdutos() {
    this.atualizaProdutos.emit(true);
  }


  getProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.baseURL);
  }

  getProdutoById(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.baseURL}/${id}`);
  }

  getIdUltimoProduto(): Observable<Produto> {
    return this.http.get<Produto>(`${this.baseURL}/idUltimoProduto`);
  }

  cadastrarProduto(produto: Produto) {
    return this.http.post(`${this.baseURL}/cadastrar`, produto);
  }

  editarProduto(produto: Produto) {
    return this.http.put(`${this.baseURL}/editar/${produto.id}`, produto);
  }

  excluirProduto(id: number) {
    return this.http.delete(`${this.baseURL}/excluir/${id}`);
  }

}
