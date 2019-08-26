import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { HttpClient } from '@angular/common/http';
import { Venda } from 'src/app/_models/Movimentos/Venda/Venda';
import { VendaProduto } from 'src/app/_models/Movimentos/Venda/VendaProduto';
import { VendaValorPrevisto } from 'src/app/_models/Movimentos/Venda/VendaValorPrevisto';
import { VendaValorRealizado } from 'src/app/_models/Movimentos/Venda/VendaValorRealizado';
import { VendaConfig } from 'src/app/_models/Movimentos/Venda/VendaConfig';

@Injectable({
  providedIn: 'root'
})
export class VendaService {

baseURL = InfoAPI.URL + '/api/movimentos/vendas';
atualizaVenda = new EventEmitter<boolean>();
atualizaRecebimentos = new EventEmitter<boolean>();
atualizaPagamentos = new EventEmitter<boolean>();
atualizaResumoVenda = new EventEmitter<boolean>();

pagamentosVenda = false;
configVenda = false;

constructor(private http: HttpClient) { }

getConfigVendaStatus() {
  return this.configVenda;
}

setConfigVendaStatus(val: boolean) {
  this.configVenda = val;
}

getPagamentosVendaStatus() {
  return this.pagamentosVenda;
}

setPagamentosVendaStatus(val: boolean) {
  this.pagamentosVenda = val;
}

getAllVenda(): Observable<Venda[]> {
  return this.http.get<Venda[]>(this.baseURL);
}

getVendaByClienteId(clienteId: number): Observable<Venda[]> {
  return this.http.get<Venda[]>(`${this.baseURL}/getByClienteId/${clienteId}`);
}

atualizarVenda() {
  this.atualizaVenda.emit(true);
}
atualizarRecebimentos() {
  this.atualizaRecebimentos.emit(true);
}
atualizarPagamentos() {
  this.atualizaPagamentos.emit(true);
}
atualizarResumoVenda() {
  this.atualizaResumoVenda.emit(true);
}

getVendaById(id: number): Observable<Venda> {
  return this.http.get<Venda>(`${this.baseURL}/${id}`);
}

getVendaConfig(): Observable<VendaConfig> {
  return this.http.get<VendaConfig>(`${this.baseURL}/config`);
}

novoVendaConfig(vendaConfig: VendaConfig) {
  return this.http.post(`${this.baseURL}/config/novo`, vendaConfig);
}

editarVendaConfig(vendaConfig: VendaConfig) {
  return this.http.put(`${this.baseURL}/config/editar/${vendaConfig.id}`, vendaConfig);
}

getIdUltimaVenda(): Observable<Venda> {
  return this.http.get<Venda>(`${this.baseURL}/idUltimaVenda`);
}

novoProdutoVenda(produtos: VendaProduto[]) {
  return this.http.post(`${this.baseURL}/produtos/novo`, produtos);
}

getVendaValorPrevistoByProdIdVendId(idProdutoItem: number, idVenda: number): Observable<VendaValorPrevisto> {
  return this.http.get<VendaValorPrevisto>(`${this.baseURL}/valorprevisto/${idProdutoItem}/${idVenda}`);
}

getVendaValoresRealizadosByProdIdVendId(idProdutoItem: number, idVenda: number): Observable<VendaValorRealizado> {
  return this.http.get<VendaValorRealizado>(`${this.baseURL}/valorrealizado/${idProdutoItem}/${idVenda}`);
}

getVerificaPagamentoByProdIdVendId(idProdutoItem: number, idVenda: number): Observable<boolean> {
  return this.http.get<boolean>(`${this.baseURL}/valorrealizado/pago/${idProdutoItem}/${idVenda}`);
}


novoVendaValorPrevisto(vendaValorPrevisto: VendaValorPrevisto) {
  return this.http.post(`${this.baseURL}/valorprevisto/novo`, vendaValorPrevisto);
}

novoVendaValorRealizado(vendaValorRealizado: VendaValorRealizado) {
  return this.http.post(`${this.baseURL}/valorrealizado/novo`, vendaValorRealizado);
}

getIdUltimoValorRealizado(): Observable<VendaValorRealizado> {
  return this.http.get<VendaValorRealizado>(`${this.baseURL}/valorrealizado/idUltimo`);
}

novoVenda(venda: Venda) {
  return this.http.post(`${this.baseURL}/novo`, venda);
}

editarVenda(venda: Venda) {
  return this.http.put(`${this.baseURL}/editar/${venda.id}`, venda);
}

}
