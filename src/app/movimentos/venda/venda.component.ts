import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BsLocaleService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { Venda } from 'src/app/_models/Movimentos/Venda/Venda';
import { FormGroup } from '@angular/forms';
import { VendaService } from 'src/app/_services/Movimentos/Venda/venda.service';
import { Permissao } from 'src/app/_models/Permissoes/permissao';

@Component({
  selector: 'app-venda',
  templateUrl: './venda.component.html'
})
export class VendaComponent implements OnInit, AfterViewInit {

  novo = false;
  editar = false;
  excluir = false;
  visualizar = false;

  vendas: Venda[];

  paginaAtual = 1;
  totalRegistros = 0; number;

  constructor(private toastr: ToastrService,
              public permissaoService: PermissaoService,
              public vendaService: VendaService) { }

  ngOnInit() {
    this.getVendas();
  }

  ngAfterViewInit() {
    this.permissaoService.getPermissoesByFormulario(
      Object.assign({formulario: 'VENDA'})).subscribe((_PERMISSOES: Permissao[]) => {
      this.novo = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'NOVO')[0]);
      this.editar = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'EDITAR')[0]);
      this.visualizar = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'VISUALIZAR')[0]);
    });
  }

  getVendas() {
    this.vendaService.getAllVenda().subscribe(
      // tslint:disable-next-line:variable-name
      (_VENDAS: Venda[]) => {
      this.vendas = _VENDAS;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar VendaS: ${error.error}`);
    });
}

getVendaConfig() {
  return this.vendaService.getConfigVendaStatus();
}

abrirVendaConfig() {
  this.vendaService.setConfigVendaStatus(true);
}

}
