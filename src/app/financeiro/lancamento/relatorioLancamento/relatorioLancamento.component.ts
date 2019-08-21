import { Component, OnInit } from '@angular/core';
import { Lancamentos } from 'src/app/_models/Movimentos/Lancamentos/Lancamentos';
import { BsLocaleService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { LancamentoService } from 'src/app/_services/Movimentos/Lancamentos/lancamento.service';
import { PlanoContas } from 'src/app/_models/Cadastros/PlanoContas/planoContas';
import { PlanoContaService } from 'src/app/_services/Cadastros/PlanosConta/planoConta.service';

@Component({
  selector: 'app-relatorio-lancamento',
  templateUrl: './relatorioLancamento.component.html',
  styleUrls: ['./relatorioLancamento.component.css']
})
export class RelatorioLancamentoComponent implements OnInit {

  lancamentos: Lancamentos[];
  planoContas: PlanoContas[];
  planoContasFiltrados: PlanoContas[];

  filtrarPor = ['GERAL', 'CONTA SINTÉTICA', 'CONTA ANALÍTICA'];
  filtroSelecionado = 'GERAL';

  contaSelecionada: number;

  listaContas: PlanoContas;
  listaContasFiltradas: PlanoContas[] = [];
  idContasVerificadas: any = [];
  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService,
              public permissaoService: PermissaoService,
              private planoContaService: PlanoContaService,
              public lancamentoService: LancamentoService) { }

  ngOnInit() {
    this.getLancamentos();
    this.getPlanoContas();
  }

  setFiltroSelecionado(valor: any) {
    this.filtroSelecionado = valor;
    this.planoContasFiltrados = this.filtrarPlanoContas();
  }

  filtrarPlanoContas(): PlanoContas[] {
    if (this.planoContas) {
      if (this.filtroSelecionado === 'CONTA SINTÉTICA') {
        return this.planoContas.filter(c => c.categoria === 'SINTÉTICA');
      } else if (this.filtroSelecionado === 'CONTA ANALÍTICA') {
        return this.planoContas.filter(c => c.categoria === 'ANALÍTICA');
      } else {
        return this.planoContas;
      }
    } else {
      return [];
    }
  }

  retornaInferiores(idSuperior: number) {
    return this.planoContas.filter(c => c.planoContasId === idSuperior);
  }

  async filtrarLancamentos(conta: PlanoContas) {
    let debito = 0;
    let credito = 0;
    this.lancamentos.filter(c => c.planoDebitoId === conta.id).forEach((lancamento => {
      debito = lancamento.valor + debito;
    }));
    this.lancamentos.filter(c => c.planoCreditoId === conta.id).forEach((lancamento => {
      credito = lancamento.valor + credito;
    }));
    const saldo = (debito - credito);
    let espaco = '';
    for (let index = 0; index < conta.nivel.length; index++) {
      espaco += '  ';
      index = index;
    }
    conta = Object.assign(conta, {valorDebito: debito, valorCredito: credito, espacamento: espaco,
      valorSaldo: (saldo < 0) ? (saldo * -1) : saldo, saldoTipo: (saldo < 0) ? 'C' : 'D',
      negrito: (conta.categoria === 'SINTÉTICA') ? 'bold' : 'regular'});
    this.listaContasFiltradas.push(conta);
    if (conta.planoConta) {
      conta.planoConta.forEach((contaFilho) => {
        this.filtrarLancamentos(contaFilho);
      });
    }
  }

  getLancamentos() {
    this.lancamentoService.getAllLancamentos().subscribe(
      (_LANCAMENTOS: Lancamentos[]) => {
      this.lancamentos = _LANCAMENTOS;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar VendaS: ${error.error}`);
    });
  }

  getPlanoContasFilhosPorId(idConta: number) {
    this.planoContaService.getAllPlanosConta().subscribe(
      (_PLANOS: PlanoContas[]) => {
      this.listaContas = _PLANOS.filter(c => c.id === idConta)[0];
      this.listaContasFiltradas = [];
      this.filtrarLancamentos(this.listaContas);
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Planos de Contas: ${error.error}`);
    });
  }

  getPlanoContas() {
    this.planoContaService.getAllPlanosConta().subscribe(
      (_PLANOS: PlanoContas[]) => {
      this.planoContas = _PLANOS;
      this.setFiltroSelecionado('GERAL');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar Planos de Contas: ${error.error}`);
    });
  }
}
