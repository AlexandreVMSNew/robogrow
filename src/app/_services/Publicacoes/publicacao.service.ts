import { Injectable, EventEmitter } from '@angular/core';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { PublicacaoComentario } from 'src/app/_models/Publicacoes/PublicacaoComentario';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { PublicacaoArquivos } from 'src/app/_models/Publicacoes/PublicacaoArquivos';
import { saveAs } from 'file-saver';
import { Observable } from 'rxjs';
import { Publicacao } from 'src/app/_models/Publicacoes/Publicacao';

@Injectable({
  providedIn: 'root'
})
export class PublicacaoService {

  baseURL = InfoAPI.URL + '/publicacoes';

  atualizaPublicacoes = new EventEmitter<boolean>();
  atualizaPublicacaoComentarios = new EventEmitter<number>();

  publicacaoTemplate = false;

  constructor(private http: HttpClient) { }

  atualizarPublicacoes() {
    this.atualizaPublicacoes.emit(true);
  }

  atualizarPublicacaoComentarios(publicacaoId: number) {
    this.atualizaPublicacaoComentarios.emit(publicacaoId);
  }

  getPublicacaoTemplateStatus() {
    return this.publicacaoTemplate;
  }

  setPublicacaoTemplateStatus(val: boolean) {
    this.publicacaoTemplate = val;
  }

  novaPublicacao(publicacao: Publicacao): Observable<Publicacao>  {
    return this.http.post<Publicacao>(`${this.baseURL}/cadastrar`, publicacao);
  }

  editarPublicacao(publicacao: Publicacao): Observable<Publicacao>  {
    return this.http.put<Publicacao>(`${this.baseURL}/editar/${publicacao.id}`, publicacao);
  }

  excluirPublicacao(publicacaoId: number): Observable<Publicacao>  {
    return this.http.delete<Publicacao>(`${this.baseURL}/excluir/${publicacaoId}`);
  }

  cadastrarPublicacaoComentario(comentario: PublicacaoComentario) {
    return this.http.post(`${this.baseURL}/comentario/cadastrar`, comentario);
  }

  getPublicacaoArquivos(publicacaoId: number) {
    return this.http.get(`${this.baseURL}/${publicacaoId}/arquivos`);
  }

  getPublicacoesUsuarioMarcado(usuarioId: number) {
    return this.http.get(`${this.baseURL}/usuario/${usuarioId}`);
  }


  getPublicacoes() {
    return this.http.get(`${this.baseURL}/`);
  }

  getPublicacao(publicacaoId: number) {
    return this.http.get(`${this.baseURL}/${publicacaoId}`);
  }

  getPublicacaoComentarios(publicacaoId: number) {
    return this.http.get(`${this.baseURL}/${publicacaoId}/comentarios`);
  }

  downloadArquivoPublicacao(publicacaoId: number, publicacaoArquivo: PublicacaoArquivos): Observable<any> {
    return this.http.post(`${this.baseURL}/${publicacaoId}/arquivo/download`, publicacaoArquivo, {
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  enviarArquivosPublicacao(publicacaoId: number, arquivos: File[], nomeArquivos: any) {
    const  formData = new FormData();
    arquivos.forEach((arquivo: any) => {
      formData.append('arquivo', arquivo, nomeArquivos[arquivos.indexOf(arquivo, 0)]);
    });
    return this.http.post(`${this.baseURL}/${publicacaoId}/upload/arquivos`, formData);
  }

}
