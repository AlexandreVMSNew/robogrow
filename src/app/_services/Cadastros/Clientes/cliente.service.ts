import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from 'src/app/_models/Cadastros/Clientes/Cliente';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  baseURL = InfoAPI.URL + '/api/clientes';
constructor(private http: HttpClient) { }

getAllCliente(): Observable<Cliente[]> {
  return this.http.get<Cliente[]>(this.baseURL);
}

getClienteByName(name: string): Observable<Cliente[]> {
  return this.http.get<Cliente[]>(`${this.baseURL}/getByName/${name}`);
}
getClienteById(id: number): Observable<Cliente> {
  return this.http.get<Cliente>(`${this.baseURL}/${id}`);
}

getIdUltimoCliente(): Observable<Cliente> {
  return this.http.get<Cliente>(`${this.baseURL}/idultimocliente`);
}

novoCliente(cliente: Cliente) {
  return this.http.post(`${this.baseURL}/novo`, cliente);
}

editarCliente(cliente: Cliente) {
  return this.http.put(`${this.baseURL}/editar/${cliente.id}`, cliente);
}

deletarCliente(id: number) {
  return this.http.delete(`${this.baseURL}/${id}`);
}

}
