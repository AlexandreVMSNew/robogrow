import { Component, OnInit, Input } from '@angular/core';
import { PublicacaoService } from 'src/app/_services/Publicacoes/publicacao.service';
import { VendaPublicacao } from 'src/app/_models/Movimentos/Venda/VendaPublicacao';
import * as moment from 'moment';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { ToastrService } from 'ngx-toastr';
import { Publicacao } from 'src/app/_models/Publicacoes/Publicacao';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';

@Component({
  selector: 'app-publicacao-venda',
  templateUrl: './publicacaoVenda.component.html',
  styleUrls: ['./publicacaoVenda.component.css']
})

export class PublicacaoVendaComponent implements OnInit {
  @Input() vendaId: number;
  @Input() vendaPublicacoes: VendaPublicacao[];

  textoComentarioAux = '';

  constructor(private publicacaoService: PublicacaoService,
              private permissaoService: PermissaoService,
              private toastr: ToastrService) { }

  ngOnInit() {
  }

  getTemplatePublicacao() {
    return this.publicacaoService.getPublicacaoTemplateStatus();
  }

  abrirTemplatePublicacao() {
    this.publicacaoService.setPublicacaoTemplateStatus(true);
  }

  getUrlUsuarioLogadoFotoPerfil(): string {
    return this.permissaoService.getUrlUsuarioLogadoFotoPerfil();
  }

  getUrlUsuarioVisitanteFotoPerfil(): string {
    return InfoAPI.URL + '/api/usuarios/Visitante/perfil/';
  }

  urlUsuarioFotoPerfil(usuarioId: number, nomeArquivoFotoPerfil: string): string {
    return InfoAPI.URL + '/api/usuarios/' + usuarioId + '/perfil/' + nomeArquivoFotoPerfil;
  }

  get textoComentario(): string {
    return this.textoComentarioAux;
  }

  set textoComentario(value: string) {
    this.textoComentarioAux = value;
  }

  cadastrarComentario(publicacao: Publicacao) {
    console.log(this.textoComentario);
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    const comentario = Object.assign({
      id: 0,
      publicacoesId: publicacao.id,
      usuarioId: this.permissaoService.getUsuarioId(),
      texto: publicacao.textoComentario,
      dataHora: dataAtual,
      dataHoraAlteracao: dataAtual,
    });
    this.publicacaoService.novoPublicacaoComentario(comentario).subscribe(() => {
      this.textoComentario = '';
      this.toastr.success(`Comentário cadastrado!`);
    }, error => {
      console.log(error.error);
    });
  }

}
