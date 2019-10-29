import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ChequePre } from 'src/app/_models/Cadastros/ChequePre/ChequePre';
import { BsLocaleService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { ChequePreService } from 'src/app/_services/Cadastros/ChequePre/chequePre.service';
import { Permissao } from 'src/app/_models/Permissoes/permissao';
import { PermissaoObjetos } from 'src/app/_models/Permissoes/permissaoObjetos';

@Component({
  selector: 'app-cheque-pre',
  templateUrl: './chequePre.component.html'
})
export class ChequePreComponent implements OnInit, AfterViewInit {

  formularioComponent = 'CHEQUE PRÉ-DATADO';
  cadastrar = false;
  editar = false;
  listar = false;
  visualizar = false;
  excluir = false;

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
    this.permissaoService.getPermissaoObjetosByFormularioAndNivelId(Object.assign({ formulario: this.formularioComponent }))
    .subscribe((permissaoObjetos: PermissaoObjetos[]) => {
      const permissaoFormulario = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'FORMULÁRIO');
      this.cadastrar = (permissaoFormulario !== null ) ? permissaoFormulario.cadastrar : false;
      this.editar = (permissaoFormulario !== null ) ? permissaoFormulario.editar : false;
      this.listar = (permissaoFormulario !== null ) ? permissaoFormulario.listar : false;
      this.visualizar = (permissaoFormulario !== null ) ? permissaoFormulario.visualizar : false;
      this.excluir = (permissaoFormulario !== null ) ? permissaoFormulario.excluir : false;
    }, error => {
      console.log(error.error);
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
    this.chequePreService.getChequePre().subscribe(
      // tslint:disable-next-line:variable-name
      (_CHEQUES: ChequePre[]) => {
      this.cheques = _CHEQUES;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar ChequePre: ${error.error}`);
  });
}

}
