import { Injectable, EventEmitter } from '@angular/core';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { Produto } from 'src/app/_models/Cadastros/Produtos/produto';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProdutoItem } from 'src/app/_models/Cadastros/Produtos/produtoItem';
import { ProdutoGrupoChecks } from 'src/app/_models/Cadastros/Produtos/produtoGrupoChecks';
import { ProdutoCheckList } from 'src/app/_models/Cadastros/Produtos/produtoCheckList';
import { ProdutoCheckListOpcoes } from 'src/app/_models/Cadastros/Produtos/ProdutoCheckListOpcoes';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  baseURL = InfoAPI.URL + '/produtos';

  atualizaProdutos = new EventEmitter<boolean>();
  atualizaProdutosGruposCheck = new EventEmitter<ProdutoGrupoChecks[]>();

  retornoPermissao = false;
  checkListProduto = false;
  produtoItens = false;

constructor(private http: HttpClient) { }

atualizarProdutos() {
  this.atualizaProdutos.emit(true);
}

atualizarProdutosGruposCheck(produtoGrupo: ProdutoGrupoChecks[]) {
  this.atualizaProdutosGruposCheck.emit(produtoGrupo);
}

setProdutoItensStatus(val: boolean) {
  this.produtoItens = val;
}

getProdutoItensStatus() {
  return this.produtoItens;
}


setCheckListProdutoStatus(val: boolean) {
  this.checkListProduto = val;
}

getCheckListProdutoStatus() {
  return this.checkListProduto;
}

getProduto(): Observable<Produto[]> {
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

novoProdutoGrupoCheck(produtoGrupoCheck: ProdutoGrupoChecks) {
  return this.http.post(`${this.baseURL}/grupoChecks/novo`, produtoGrupoCheck);
}

editarProdutoGrupoCheck(produtoGrupoCheck: ProdutoGrupoChecks) {
  return this.http.put(`${this.baseURL}/grupoChecks/editar/${produtoGrupoCheck.id}`, produtoGrupoCheck);
}

excluirProdutoGrupoCheck(id: number) {
  return this.http.delete(`${this.baseURL}/grupoChecks/excluir/${id}`);
}

novoProdutoCheckList(produtoCheckList: ProdutoCheckList) {
  return this.http.post(`${this.baseURL}/grupoChecks/check/novo`, produtoCheckList);
}

novoProdutoCheckListOpcoes(produtoCheckListOpcoes: ProdutoCheckListOpcoes) {
  return this.http.post(`${this.baseURL}/grupoChecks/opcao/novo`, produtoCheckListOpcoes);
}
getProdutoGrupoCheckByProdutoId(produtoId: number): Observable<ProdutoGrupoChecks[]> {
  return this.http.get<ProdutoGrupoChecks[]>(`${this.baseURL}/grupoChecks/produto/${produtoId}`);
}

}
