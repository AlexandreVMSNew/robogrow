import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ChequePre } from 'src/app/_models/Cadastros/ChequePre/ChequePre';
import { BsLocaleService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { ChequePreService } from 'src/app/_services/Cadastros/ChequePre/chequePre.service';
import { Permissao } from 'src/app/_models/Permissoes/permissao';

@Component({
  selector: 'app-cheque-pre',
  templateUrl: './chequePre.component.html'
})
export class ChequePreComponent implements OnInit, AfterViewInit {

  novo = false;
  editar = false;
  visualizar = false;

  cheques: ChequePre[];

  paginaAtual = 1;
  totalRegistros = 0; number;

  idChequePre: number;
  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService,
              public permissaoService: PermissaoService,
              public chequePreService: ChequePreService) { }

  ngOnInit() {
    this.getChequePre();
  }

  ngAfterViewInit() {
    this.permissaoService.getPermissoesByFormulario(
      Object.assign({formulario: 'CHEQUES PRE-DATADO'})).subscribe((_PERMISSOES: Permissao[]) => {
      this.novo = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'NOVO')[0]);
      this.editar = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'EDITAR')[0]);
      this.visualizar = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'VISUALIZAR')[0]);
    });
  }

  getTemplateChequePre() {
    return this.chequePreService.getChequePreTemplateStatus();
  }

  abrirTemplateChequePre(idLancamento: number) {
    this.idChequePre = idLancamento;
    this.chequePreService.setChequePreTemplateStatus(true);
  }

  getChequePre() {
    this.chequePreService.getAllChequePre().subscribe(
      // tslint:disable-next-line:variable-name
      (_CHEQUES: ChequePre[]) => {
      this.cheques = _CHEQUES;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar ChequePre: ${error.error}`);
  });
}

}
