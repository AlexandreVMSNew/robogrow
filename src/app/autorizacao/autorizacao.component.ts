import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Autorizacao } from '../_models/Autorizacoes/Autorizacao';
import { FormGroup } from '@angular/forms';
import { AutorizacaoService } from '../_services/Autorizacoes/autorizacao.service';
import { BsLocaleService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PermissaoService } from '../_services/Permissoes/permissao.service';
import { Permissao } from '../_models/Permissoes/permissao';

@Component({
  selector: 'app-autorizacao',
  templateUrl: './autorizacao.component.html',
  styleUrls: ['./autorizacao.component.css']
})
export class AutorizacaoComponent implements OnInit, AfterViewInit {

  novo = false;
  editar = false;
  visualizar = false;

  autorizacao: Autorizacao;
  autorizacoes: Autorizacao[];

  modoSalvar = '';
  cadastroAutorizacao: FormGroup;

  paginaAtual = 1;
  totalRegistros = 0;

  valueCnpjCpfPipe = '';

  idAutorizacao: number;

  constructor(
    private autorizacaoService: AutorizacaoService,
    private localeService: BsLocaleService,
    private toastr: ToastrService,
    public permissaoService: PermissaoService
    ) {
      this.autorizacaoService.atualizaAutorizacoes.subscribe(x => {
        this.getAutorizacoes();
      });
      this.localeService.use('pt-br');
    }

  ngOnInit() {
    this.getAutorizacoes();
  }

  ngAfterViewInit() {
    this.permissaoService.getPermissoesByFormulario(Object.assign({formulario: 'EMPRESAS'})).subscribe((_PERMISSAO: Permissao[]) => {
      this.novo = this.permissaoService.verificarPermissao(_PERMISSAO.filter(c => c.acao === 'NOVO')[0]);
      this.editar = this.permissaoService.verificarPermissao(_PERMISSAO.filter(c => c.acao === 'EDITAR')[0]);
      this.visualizar = this.permissaoService.verificarPermissao(_PERMISSAO.filter(c => c.acao === 'VISUALIZAR')[0]);
    });
  }

  getTemplateAutorizacao() {
    return this.autorizacaoService.getAutorizacaoTemplateStatus();
  }

  abrirTemplateAutorizacao(idAutorizacao: number) {
    this.idAutorizacao = idAutorizacao;
    this.autorizacaoService.setAutorizacaoTemplateStatus(true);
  }


  getAutorizacoes() {
    this.autorizacaoService.getAllAutorizacoes().subscribe(
      (_EMPRESAS: Autorizacao[]) => {
      this.autorizacoes = _EMPRESAS;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar autorizacoes: ${error.error}`);
    });
  }

}
