import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { UsuarioComponent } from './cadastros/usuario/usuario.component';
import { LoginComponent } from './cadastros/usuario/login/login.component';
import { CadastrarUsuarioComponent } from './cadastros/usuario/cadastrarUsuario/cadastrarUsuario.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditarUsuarioComponent } from './cadastros/usuario/editarUsuario/editarUsuario.component';
import { ClienteComponent } from './cadastros/cliente/cliente.component';
import { CadastrarClienteComponent } from './cadastros/cliente/cadastrarCliente/cadastrarCliente.component';
import { EditarClienteComponent } from './cadastros/cliente/editarCliente/editarCliente.component';
import { AtendimentoComponent } from './atendimento/atendimento.component';
import { RetornoComponent } from './atendimento/retorno/retorno.component';
import { CadastrarRetornoComponent } from './atendimento/retorno/cadastrarRetorno/cadastrarRetorno.component';
import { EditarRetornoComponent } from './atendimento/retorno/editarRetorno/editarRetorno.component';
import { EditarSenhaUsuarioComponent } from './cadastros/usuario/editarSenhaUsuario/editarSenhaUsuario.component';
import { PermissaoComponent } from './configuracoes/permissao/permissao.component';
import { VendaComponent } from './movimentos/venda/venda.component';
import { CadastrarVendaComponent } from './movimentos/venda/cadastrarVenda/cadastrarVenda.component';
import { EditarVendaComponent } from './movimentos/venda/editarVenda/editarVenda.component';
import { RelatorioVendaComponent } from './movimentos/venda/relatorioVenda/relatorioVenda.component';
import { ProdutoComponent } from './cadastros/produto/produto.component';
import { CadastrarProdutoComponent } from './cadastros/produto/cadastrarProduto/cadastrarProduto.component';
import { EditarProdutoComponent } from './cadastros/produto/editarProduto/editarProduto.component';
import { PessoaComponent } from './cadastros/pessoa/pessoa.component';
import { EditarPessoaComponent } from './cadastros/pessoa/editarPessoa/editarPessoa.component';
import { CadastrarPessoaComponent } from './cadastros/pessoa/cadastrarPessoa/cadastrarPessoa.component';
import { PlanoContaComponent } from './cadastros/planoConta/planoConta.component';
import { CentroReceitaComponent } from './cadastros/centroReceita/centroReceita.component';
import { CentroDespesaComponent } from './cadastros/centroDespesa/centroDespesa.component';
import { FormaPagamentoComponent } from './cadastros/formaPagamento/formaPagamento.component';
import { PlanoPagamentoComponent } from './cadastros/planoPagamento/planoPagamento.component';
import { RecebimentoComponent } from './financeiro/recebimento/recebimento.component';
import { LancamentoComponent } from './financeiro/lancamento/lancamento.component';
import { ChequePreComponent } from './cadastros/chequePre/chequePre.component';
import { RelatorioLancamentoComponent } from './financeiro/lancamento/relatorioLancamento/relatorioLancamento.component';
import { PagamentoComponent } from './financeiro/pagamento/pagamento.component';
import { EmpresaComponent } from './cadastros/empresa/empresa.component';
import { AutorizacaoComponent } from './autorizacao/autorizacao.component';
import { TimelineComponent } from './timeline/timeline/timeline.component';

export const routes: Routes = [
  { path: 'usuarios', component: UsuarioComponent, canActivate: [AuthGuard]},
  { path: 'usuarios/login', component: LoginComponent},
  { path: 'usuarios/cadastrar', component: CadastrarUsuarioComponent, canActivate: [AuthGuard]},
  { path: 'usuarios/editar/:id', component: EditarUsuarioComponent, canActivate: [AuthGuard]},
  { path: 'usuarios/editar/senha/:id', component: EditarSenhaUsuarioComponent, canActivate: [AuthGuard]},
  { path: 'clientes', component: ClienteComponent, canActivate: [AuthGuard]},
  { path: 'clientes/cadastrar', component: CadastrarClienteComponent, canActivate: [AuthGuard]},
  { path: 'clientes/editar/:id', component: EditarClienteComponent, canActivate: [AuthGuard]},
  { path: 'atendimentos/retornos', component: RetornoComponent, canActivate: [AuthGuard]},
  { path: 'atendimentos/retornos/cadastrar', component: CadastrarRetornoComponent, canActivate: [AuthGuard]},
  { path: 'atendimentos/retorno/:id', component: RetornoComponent, canActivate: [AuthGuard]},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  { path: 'permissoes', component: PermissaoComponent, canActivate: [AuthGuard]},
  { path: 'movimentos/vendas', component: VendaComponent, canActivate: [AuthGuard]},
  { path: 'movimentos/vendas/cadastrar', component: CadastrarVendaComponent, canActivate: [AuthGuard]},
  { path: 'movimentos/vendas/editar/:id', component: EditarVendaComponent, canActivate: [AuthGuard]},
  { path: 'movimentos/vendas/relatorios', component: RelatorioVendaComponent, canActivate: [AuthGuard]},
  { path: 'produtos', component: ProdutoComponent, canActivate: [AuthGuard]},
  { path: 'produtos/cadastrar', component: CadastrarProdutoComponent, canActivate: [AuthGuard]},
  { path: 'produtos/editar/:id', component: EditarProdutoComponent, canActivate: [AuthGuard]},
  { path: 'pessoas', component: PessoaComponent, canActivate: [AuthGuard]},
  { path: 'pessoas/cadastrar', component: CadastrarPessoaComponent, canActivate: [AuthGuard]},
  { path: 'pessoas/editar/:id', component: EditarPessoaComponent, canActivate: [AuthGuard]},
  { path: 'plano-conta', component: PlanoContaComponent, canActivate: [AuthGuard]},
  { path: 'centro-receita', component: CentroReceitaComponent, canActivate: [AuthGuard]},
  { path: 'centro-despesa', component: CentroDespesaComponent, canActivate: [AuthGuard]},
  { path: 'forma-pagamento', component: FormaPagamentoComponent, canActivate: [AuthGuard]},
  { path: 'plano-pagamento', component: PlanoPagamentoComponent, canActivate: [AuthGuard]},
  { path: 'financeiro/recebimentos', component: RecebimentoComponent, canActivate: [AuthGuard]},
  { path: 'financeiro/pagamentos', component: PagamentoComponent, canActivate: [AuthGuard]},
  { path: 'financeiro/lancamentos', component: LancamentoComponent, canActivate: [AuthGuard]},
  { path: 'financeiro/lancamentos/relatorios', component: RelatorioLancamentoComponent, canActivate: [AuthGuard]},
  { path: 'cheque-pre', component: ChequePreComponent, canActivate: [AuthGuard]},
  { path: 'empresas', component: EmpresaComponent, canActivate: [AuthGuard]},
  { path: 'autorizacoes', component: AutorizacaoComponent, canActivate: [AuthGuard]},
  { path: 'autorizacao/:id', component: AutorizacaoComponent, canActivate: [AuthGuard]},
  { path: 'timeline', component: TimelineComponent, canActivate: [AuthGuard]},

  { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule]
})
export class AppRoutingModule { }
