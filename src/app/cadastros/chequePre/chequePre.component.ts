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
  totalRegistros: number;

  idChequePre: number;
  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService,
              public permissaoService: PermissaoService,
              public chequePreService: ChequePreService) { }

  ngOnInit() {
    this.getChequePre();
  }

  ngAfterViewInit() {
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('CHEQUES PRE-DATADO', 'NOVO').subscribe((_PERMISSAO: Permissao) => {
      this.novo = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('CHEQUES PRE-DATADO', 'EDITAR').subscribe((_PERMISSAO: Permissao) => {
      this.editar = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('CHEQUES PRE-DATADO', 'VISUALIZAR').subscribe((_PERMISSAO: Permissao) => {
      this.visualizar = this.permissaoService.verificarPermissao(_PERMISSAO);
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
