import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Lancamentos } from 'src/app/_models/Movimentos/Lancamentos/Lancamentos';
import { BsLocaleService } from 'ngx-bootstrap';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { LancamentoService } from 'src/app/_services/Movimentos/Lancamentos/lancamento.service';
import { ToastrService } from 'ngx-toastr';
import { Permissao } from 'src/app/_models/Permissoes/permissao';

@Component({
  selector: 'app-lancamento',
  templateUrl: './lancamento.component.html'
})
export class LancamentoComponent implements OnInit, AfterViewInit {

  novo = false;
  editar = false;
  visualizar = false;

  lancamentos: Lancamentos[];

  paginaAtual = 1;
  totalRegistros = 0; number;

  idLancamento: number;
  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService,
              public permissaoService: PermissaoService,
              private lancamentoService: LancamentoService) { }

  ngOnInit() {
    this.getLancamentos();
  }

  ngAfterViewInit() {
    this.permissaoService.getPermissoesByFormulario(
      Object.assign({formulario: 'LANÇAMENTOS'})).subscribe((_PERMISSOES: Permissao[]) => {
      this.novo = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'NOVO')[0]);
      this.editar = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'EDITAR')[0]);
      this.visualizar = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'VISUALIZAR')[0]);
    });
  }

  getLancamentoTemplate() {
    return this.lancamentoService.getLancamentoTemplateStatus();
  }

  abrirTemplateLancamento(idLancamento: number) {
    this.idLancamento = idLancamento;
    this.lancamentoService.setLancamentoTemplateStatus(true);
  }

  getLancamentos() {
    this.lancamentoService.getAllLancamentos().subscribe(
      // tslint:disable-next-line:variable-name
      (_LANCAMENTOS: Lancamentos[]) => {
      this.lancamentos = _LANCAMENTOS;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar VendaS: ${error.error}`);
  });
}


}
