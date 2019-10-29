import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Autorizacao } from '../_models/Autorizacoes/Autorizacao';
import { FormGroup } from '@angular/forms';
import { AutorizacaoService } from '../_services/Autorizacoes/autorizacao.service';
import { BsLocaleService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PermissaoService } from '../_services/Permissoes/permissao.service';
import { Permissao } from '../_models/Permissoes/permissao';
import { PermissaoObjetos } from '../_models/Permissoes/permissaoObjetos';

@Component({
  selector: 'app-autorizacao',
  templateUrl: './autorizacao.component.html',
  styleUrls: ['./autorizacao.component.css']
})
export class AutorizacaoComponent implements OnInit, AfterViewInit {

  formularioComponent = 'AUTORIZAÇÕES';
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
    this.permissaoService.getPermissaoObjetosByFormularioAndNivelId(Object.assign({ formulario: this.formularioComponent }))
    .subscribe((permissaoObjetos: PermissaoObjetos[]) => {
      const permissaoFormulario = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'FORMULÁRIO');
      this.editar = (permissaoFormulario !== null ) ? permissaoFormulario.editar : false;
      this.visualizar = (permissaoFormulario !== null ) ? permissaoFormulario.visualizar : false;
    }, error => {
      console.log(error.error);
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
    this.autorizacaoService.getAutorizacoes().subscribe(
      (_EMPRESAS: Autorizacao[]) => {
      this.autorizacoes = _EMPRESAS;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar autorizacoes: ${error.error}`);
    });
  }

}
