import { Injectable } from '@angular/core';
import { Colaborador } from '../_models/Colaborador';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../_models/Cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  baseURL = 'http://localhost:5000/api/clientes';
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
