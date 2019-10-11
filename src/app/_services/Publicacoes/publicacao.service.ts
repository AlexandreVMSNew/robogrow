import { Injectable } from '@angular/core';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { PublicacaoComentario } from 'src/app/_models/Publicacoes/publicacaoComentario';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PublicacaoService {

  baseURL = InfoAPI.URL + '/api/publicacoes';

  publicacaoTemplate = false;

  constructor(private http: HttpClient) { }

  getPublicacaoTemplateStatus() {
    return this.publicacaoTemplate;
  }

  setPublicacaoTemplateStatus(val: boolean) {
    this.publicacaoTemplate = val;
  }

  novoPublicacaoComentario(comentario: PublicacaoComentario) {
    return this.http.post(`${this.baseURL}/comentario/novo`, comentario);
  }

}
