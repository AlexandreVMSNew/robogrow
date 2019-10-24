import { Injectable } from '@angular/core';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { Empresa } from 'src/app/_models/Cadastros/Empresas/Empresa';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  baseURL = InfoAPI.URL + '/empresas';
  empresaTemplate = false;
  constructor(private http: HttpClient) { }

  getEmpresaTemplateStatus() {
    return this.empresaTemplate;
  }
  setEmpresaTemplateStatus(val: boolean) {
    this.empresaTemplate = val;
  }
  getEmpresa(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(this.baseURL);
  }

  getEmpresaByName(name: string): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(`${this.baseURL}/getByName/${name}`);
  }
  getEmpresaById(id: number): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.baseURL}/${id}`);
  }

  getIdUltimaEmpresa(): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.baseURL}/idultimaempresa`);
  }

  enviarLogo(empresaId: number, arquivo: File, nomeArquivo) {
    const formData = new FormData();
    formData.append('arquivo', arquivo, nomeArquivo);
    return this.http.post(`${this.baseURL}/uploadlogo/${empresaId}`, formData);
  }

  novaEmpresa(empresa: Empresa) {
    return this.http.post(`${this.baseURL}/novo`, empresa);
  }

  editarEmpresa(empresa: Empresa) {
    return this.http.put(`${this.baseURL}/editar/${empresa.id}`, empresa);
  }

}
