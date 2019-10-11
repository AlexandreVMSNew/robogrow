import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { HttpClient } from '@angular/common/http';
import { Venda } from 'src/app/_models/Movimentos/Venda/Venda';
import { VendaProduto } from 'src/app/_models/Movimentos/Venda/VendaProduto';
import { VendaValorPrevisto } from 'src/app/_models/Movimentos/Venda/VendaValorPrevisto';
import { VendaValorRealizado } from 'src/app/_models/Movimentos/Venda/VendaValorRealizado';
import { VendaConfig } from 'src/app/_models/Movimentos/Venda/VendaConfig';
import { DataPeriodo } from 'src/app/_models/Cadastros/Uteis/DataPeriodo';
import { VendaCheckList } from 'src/app/_models/Movimentos/Venda/VendaCheckList';
import { VendaPublicacao } from 'src/app/_models/Movimentos/Venda/VendaPublicacao';

@Injectable({
  providedIn: 'root'
})
export class VendaService {

baseURL = InfoAPI.URL + '/api/movimentos/vendas';
atualizaVenda = new EventEmitter<boolean>();
atualizaRecebimentos = new EventEmitter<boolean>();
atualizaPagamentos = new EventEmitter<boolean>();
atualizaResultadoVenda = new EventEmitter<boolean>();
atualizaFinanceiroVenda = new EventEmitter<boolean>();

pagamentosVenda = false;
previsaoVenda = false;
recebimentosVenda = false;
configVenda = false;

pedidoVenda: any;

constructor(private http: HttpClient) { }


setPedidoVendaStatus(val: boolean) {
  this.pedidoVenda = val;
}

getPedidoVendaStatus() {
  return this.pedidoVenda;
}

setPrevisaoVendaStatus(val: boolean) {
  this.previsaoVenda = val;
}

getPrevisaoVendaStatus() {
  return this.previsaoVenda;
}

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

getRecebimentosVendaStatus() {
  return this.recebimentosVenda;
}

setRecebimentosVendaStatus(val: boolean) {
  this.recebimentosVenda = val;
}

getAllVenda(): Observable<Venda[]> {
  return this.http.get<Venda[]>(this.baseURL);
}

getAllVendaRelatorio(datas: DataPeriodo): Observable<Venda[]> {
  return this.http.post<Venda[]>(`${this.baseURL}/relatorios`, datas);
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
atualizarResultadoVenda() {
  this.atualizaResultadoVenda.emit(true);
}
atualizarFinanceiroVenda() {

  this.atualizaFinanceiroVenda.emit(true);
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

novaVendaPublicacao(vendaPublicacao: VendaPublicacao) {
  return this.http.post(`${this.baseURL}/publicacoes/novo`, vendaPublicacao);
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

getVendaCheckList(vendaId: number): Observable<VendaCheckList[]> {
  return this.http.get<VendaCheckList[]>(`${this.baseURL}/${vendaId}/checklist`);
}

editarVendaCheckList(checkList: VendaCheckList[]) {
  return this.http.post(`${this.baseURL}/checklist/editar`, checkList);
}

}
