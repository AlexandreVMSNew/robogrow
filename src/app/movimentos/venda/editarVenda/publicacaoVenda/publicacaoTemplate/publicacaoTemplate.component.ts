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

  templateEnabled = false;

  arquivosUpload: File[] = [];
  nomeArquivo = '';

  constructor(private publicacaoService: PublicacaoService,
              private fb: FormBuilder,
              private toastr: ToastrService,
              private dataService: DataService,
              private vendaService: VendaService,
              private permissaoService: PermissaoService,
              ) { }

  ngOnInit() {
    this.validarPublicacao();
  }

  validarPublicacao() {
    this.cadastroPublicacao = this.fb.group({
      id:  [''],
      texto: ['', Validators.required],
    });
  }

  adicionarArquivoUpload(event) {
    if (event.target.files && event.target.files.length) {
      this.arquivosUpload.push(event.target.files);
    }
  }

  salvarPublicacao(template: any) {
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    this.publicacao = Object.assign(this.cadastroPublicacao.value, {
      id: 0,
      usuarioId: this.permissaoService.getUsuarioId(),
      dataHora: dataAtual,
      dataHoraAlteracao: dataAtual,
    });

    this.vendaPublicacao = Object.assign({
      vendaId: this.vendaId,
      publicacoes: this.publicacao
    });
    this.vendaService.novaVendaPublicacao(this.vendaPublicacao).subscribe(() => {
      this.fecharTemplate(template);
      this.toastr.success(`Cadastrado com Sucesso!`);
    }, error => {
      console.log(error.error);
    });
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

}
