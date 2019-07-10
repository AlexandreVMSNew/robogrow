import { Injectable } from '@angular/core';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { Produto } from 'src/app/_models/Cadastros/Produtos/produto';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProdutoItem } from 'src/app/_models/Cadastros/Produtos/produtoItem';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  baseURL = InfoAPI.URL + '/api/produtos';
  retornoPermissao = false;
constructor(private http: HttpClient) { }

getAllProduto(): Observable<Produto[]> {
  return this.http.get<Produto[]>(this.baseURL);
}


getProdutoByDescricao(descricao: string): Observable<Produto[]> {
  return this.http.get<Produto[]>(`${this.baseURL}/getByDescricao/${descricao}`);
}

getProdutoById(id: number): Observable<Produto> {
  return this.http.get<Produto>(`${this.baseURL}/${id}`);
}

getVendaProdutoById(id: number): Observable<Produto> {
  return this.http.get<Produto>(`${this.baseURL}/vendas/${id}`);
}

getIdUltimoProduto(): Observable<Produto> {
  return this.http.get<Produto>(`${this.baseURL}/idUltimoProduto`);
}

novoProduto(produto: Produto) {
  return this.http.post(`${this.baseURL}/novo`, produto);
}

novoItem(Item: ProdutoItem[]) {
  return this.http.post(`${this.baseURL}/item/novo`, Item);
}

editarItem(Item: ProdutoItem[], id: number) {
  return this.http.put(`${this.baseURL}/item/editar/${id}`, Item);
}

editarProduto(produto: Produto) {
  return this.http.put(`${this.baseURL}/editar/${produto.id}`, produto);
}

excluirProduto(id: number) {
  return this.http.delete(`${this.baseURL}/excluir/${id}`);
}

}
