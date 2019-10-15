import { Component, OnInit, Input } from '@angular/core';
import { PublicacaoService } from 'src/app/_services/Publicacoes/publicacao.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Publicacao } from 'src/app/_models/Publicacoes/Publicacao';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { DataService } from 'src/app/_services/Cadastros/Uteis/data.service';
import { VendaService } from 'src/app/_services/Movimentos/Venda/venda.service';
import { VendaPublicacao } from 'src/app/_models/Movimentos/Venda/VendaPublicacao';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { Usuario } from 'src/app/_models/Cadastros/Usuarios/Usuario';
import { UsuarioService } from 'src/app/_services/Cadastros/Usuarios/usuario.service';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';

@Component({
  selector: 'app-publicacao-template',
  templateUrl: './publicacaoTemplate.component.html',
  styleUrls: ['./publicacaoTemplate.component.css']
})
export class PublicacaoTemplateComponent implements OnInit {

  @Input() vendaId: number;

  cadastroPublicacao: FormGroup;
  vendaPublicacao: VendaPublicacao;
  publicacao: Publicacao;

  usuarios: Usuario[];
  usuariosMarcados = [];

  templateEnabled = false;

  arquivosUpload: File[] = [];
  nomeArquivosUpload: any[] = [];
  nomeArquivo = '';

  constructor(private publicacaoService: PublicacaoService,
              private fb: FormBuilder,
              private toastr: ToastrService,
              private usuarioService: UsuarioService,
              private vendaService: VendaService,
              private permissaoService: PermissaoService,
              ) { }

  ngOnInit() {
    this.getUsuarios();
    this.validarPublicacao();
  }

  validarPublicacao() {
    this.cadastroPublicacao = this.fb.group({
      id:  [''],
      texto: ['', Validators.required],
      usuariosMarcados: [''],
    });
  }

  adicionarArquivoUpload(event) {
    if (event.target.files && event.target.files.length) {
      for (let i = 0; i <= event.target.files.length - 1; i++) {
        this.arquivosUpload.push(event.target.files[i]);
        this.nomeArquivosUpload.push(event.target.files[i].name);
      }
    }
  }

  excluirArquivoUpload(index) {
    this.nomeArquivosUpload.splice(index, 1);
    this.arquivosUpload.splice(index, 1);
   }

  salvarPublicacao(template: any) {
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    const arquivos = [];
    this.arquivosUpload.forEach((arquivo: File) => {
      arquivos.push(Object.assign({
        id: 0,
        arquivoNome: arquivo.name,
        arquivoTamanho: arquivo.size
      }));
    });
    const marcacoes = [];
    this.usuariosMarcados.forEach((id: number) => {
      marcacoes.push(Object.assign({
        usuarioId: id
      }));
    });

    this.publicacao = Object.assign(this.cadastroPublicacao.value, {
      id: 0,
      usuarioId: this.permissaoService.getUsuarioId(),
      dataHora: dataAtual,
      dataHoraAlteracao: dataAtual,
      publicacaoArquivos: arquivos,
      publicacaoMarcacoes: marcacoes,
    });

    this.vendaPublicacao = Object.assign({
      vendaId: this.vendaId,
      publicacoes: this.publicacao
    });
    this.vendaService.novaVendaPublicacao(this.vendaPublicacao).subscribe((publicacao: Publicacao) => {
      if (this.arquivosUpload.length > 0  && this.nomeArquivosUpload.length) {
        this.publicacaoService.enviarArquivosPublicacao(publicacao.id, this.arquivosUpload, this.nomeArquivosUpload)
        .subscribe((result: any) => {
          if (result.retorno === 'OK') {
            this.vendaService.atualizarPublicacoesVenda();
            this.fecharTemplate(template);
            this.toastr.success(`Cadastrado com Sucesso!`);
          }
        }, error => {
          console.log(error.error);
        });
      } else {
        this.vendaService.atualizarPublicacoesVenda();
        this.fecharTemplate(template);
        this.toastr.success(`Cadastrado com Sucesso!`);
      }
    }, error => {
      console.log(error.error);
    });
  }

  urlUsuarioFotoPerfil(usuarioId: number, nomeArquivoFotoPerfil: string): string {
    return InfoAPI.URL + '/api/usuarios/' + usuarioId + '/perfil/' + nomeArquivoFotoPerfil;
  }

  marcarTodos() {
    this.usuariosMarcados = this.usuarios.map(c => c.id);
  }

  desmarcarTodos() {
    this.usuariosMarcados = [];
  }

  abrirTemplate(template: any) {
    if (this.templateEnabled === false) {
      template.show();
      this.templateEnabled = true;
    }
  }

  fecharTemplate(template: any) {
    template.hide();
    this.publicacaoService.setPublicacaoTemplateStatus(false);
    this.templateEnabled = false;
  }

  getUsuarios() {
    this.usuarioService.getAllUsuario().subscribe(
      (_USUARIOS: Usuario[]) => {
      this.usuarios = _USUARIOS;
    }, error => {
      this.toastr.error(`Erro ao tentar carregar usuarios: ${error}`);
    });
}

}
