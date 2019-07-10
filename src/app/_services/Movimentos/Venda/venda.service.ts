import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { HttpClient } from '@angular/common/http';
import { Venda } from 'src/app/_models/Movimentos/Venda/Venda';
import { VendaProduto } from 'src/app/_models/Movimentos/Venda/VendaProduto';
import { VendaValorPrevisto } from 'src/app/_models/Movimentos/Venda/VendaValorPrevisto';
import { VendaValorRealizado } from 'src/app/_models/Movimentos/Venda/VendaValorRealizado';
import { VendaValorRealizadoValores } from 'src/app/_models/Movimentos/Venda/VendaValorRealizadoValores';

@Injectable({
  providedIn: 'root'
})
export class VendaService {
  baseURL = InfoAPI.URL + '/api/vendas';

constructor(private http: HttpClient) { }

getAllVenda(): Observable<Venda[]> {
  return this.http.get<Venda[]>(this.baseURL);
}

getVendaByClienteId(clienteId: number): Observable<Venda[]> {
  return this.http.get<Venda[]>(`${this.baseURL}/getByClienteId/${clienteId}`);
}

getVendaById(id: number): Observable<Venda> {
  return this.http.get<Venda>(`${this.baseURL}/${id}`);
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

getValorRealizadoValores(idValorRealizado: number): Observable<VendaValorRealizadoValores[]> {
  return this.http.get<VendaValorRealizadoValores[]>(`${this.baseURL}/valorrealizado/valores/${idValorRealizado}`);
}

novoVendaValorRealizadoValores(valores: VendaValorRealizadoValores) {
  return this.http.post(`${this.baseURL}/valorrealizado/valores/novo`, valores);
}

novoVenda(venda: Venda) {
  return this.http.post(`${this.baseURL}/novo`, venda);
}

editarVenda(venda: Venda) {
  return this.http.put(`${this.baseURL}/editar/${venda.id}`, venda);
}

}
