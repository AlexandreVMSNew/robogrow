import { Component, OnInit, Input } from '@angular/core';
import { PublicacaoService } from 'src/app/_services/Publicacoes/publicacao.service';
import { VendaPublicacao } from 'src/app/_models/Movimentos/Venda/VendaPublicacao';
import * as moment from 'moment';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { ToastrService } from 'ngx-toastr';
import { Publicacao } from 'src/app/_models/Publicacoes/Publicacao';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { PublicacaoArquivos } from 'src/app/_models/Publicacoes/PublicacaoArquivos';
import { saveAs } from 'file-saver';
import { VendaService } from 'src/app/_services/Movimentos/Venda/venda.service';
import { PublicacaoComentario } from 'src/app/_models/Publicacoes/PublicacaoComentario';
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
              private vendaService: VendaService,
              private toastr: ToastrService) {
                this.vendaService.atualizaPublicacoesVenda.subscribe(x => {
                  this.carregarPublicacoes();
                });

                this.publicacaoService.atualizaPublicacaoComentarios.subscribe((publicacaoId: number) => {
                  this.carregarPublicacaoComentarios(publicacaoId);
                });
               }

  ngOnInit() {
    this.vendaPublicacoes = this.vendaPublicacoes.reverse();
  }

  carregarPublicacoes() {
    this.vendaService.getVendaPublicacoes(this.vendaId).subscribe((vendaPublicacoes: VendaPublicacao[]) => {
      this.vendaPublicacoes = vendaPublicacoes.reverse();
    }, error => {
      console.log(error);
    });
  }

  carregarPublicacaoComentarios(publicacaoId: number) {
    this.publicacaoService.getPublicacaoComentarios(publicacaoId).subscribe((publicacaoComentarios: PublicacaoComentario[]) => {
      this.vendaPublicacoes.filter(c => c.publicacoesId === publicacaoId)[0]
        .publicacoes.publicacaoComentarios = publicacaoComentarios;
    }, error => {
      console.log(error);
    });
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

  downloadArquivo(arquivo: PublicacaoArquivos) {
    this.publicacaoService.downloadArquivoPublicacao(arquivo.publicacoesId, arquivo).subscribe(data => {
      saveAs(data, arquivo.arquivoNome);
    }, error => {
      console.log(error);
    });
  }

  get textoComentario(): string {
    return this.textoComentarioAux;
  }

  set textoComentario(value: string) {
    this.textoComentarioAux = value;
  }

  cadastrarComentario(publicacao: Publicacao) {
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
      publicacao.textoComentario = '';
      this.publicacaoService.atualizarPublicacaoComentarios(publicacao.id);
      this.toastr.success(`Comentário cadastrado!`);
    }, error => {
      console.log(error.error);
    });
  }

}
