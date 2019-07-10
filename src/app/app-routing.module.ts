import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { UsuarioComponent } from './cadastros/usuario/usuario.component';
import { LoginComponent } from './cadastros/usuario/login/login.component';
import { NovoUsuarioComponent } from './cadastros/usuario/novoUsuario/novoUsuario.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditarUsuarioComponent } from './cadastros/usuario/editarUsuario/editarUsuario.component';
import { ClienteComponent } from './cadastros/cliente/cliente.component';
import { NovoClienteComponent } from './cadastros/cliente/novoCliente/novoCliente.component';
import { EditarClienteComponent } from './cadastros/cliente/editarCliente/editarCliente.component';
import { AtendimentoComponent } from './atendimento/atendimento.component';
import { RetornoComponent } from './atendimento/retorno/retorno.component';
import { NovoRetornoComponent } from './atendimento/retorno/novoRetorno/novoRetorno.component';
import { EditarRetornoComponent } from './atendimento/retorno/editarRetorno/editarRetorno.component';
import { EditarSenhaUsuarioComponent } from './cadastros/usuario/editarSenhaUsuario/editarSenhaUsuario.component';
import { PermissaoComponent } from './permissao/permissao.component';
import { VendaComponent } from './movimentos/venda/venda.component';
import { NovoVendaComponent } from './movimentos/venda/novoVenda/novoVenda.component';
import { EditarVendaComponent } from './movimentos/venda/editarVenda/editarVenda.component';
import { ProdutoComponent } from './cadastros/produto/produto.component';
import { NovoProdutoComponent } from './cadastros/produto/novoProduto/novoProduto.component';
import { EditarProdutoComponent } from './cadastros/produto/editarProduto/editarProduto.component';
import { PessoaComponent } from './cadastros/pessoa/pessoa.component';
import { EditarPessoaComponent } from './cadastros/pessoa/editarPessoa/editarPessoa.component';
import { NovoPessoaComponent } from './cadastros/pessoa/novoPessoa/novoPessoa.component';

const routes: Routes = [
  { path: 'usuarios', component: UsuarioComponent, canActivate: [AuthGuard]},
  { path: 'usuarios/login', component: LoginComponent},
  { path: 'usuarios/novo', component: NovoUsuarioComponent, canActivate: [AuthGuard]},
  { path: 'usuarios/editar/:id', component: EditarUsuarioComponent, canActivate: [AuthGuard]},
  { path: 'usuarios/editar/senha/:id', component: EditarSenhaUsuarioComponent, canActivate: [AuthGuard]},
  { path: 'clientes', component: ClienteComponent, canActivate: [AuthGuard]},
  { path: 'clientes/novo', component: NovoClienteComponent, canActivate: [AuthGuard]},
  { path: 'clientes/editar/:id', component: EditarClienteComponent, canActivate: [AuthGuard]},
  { path: 'atendimentos', component: AtendimentoComponent, canActivate: [AuthGuard]},
  { path: 'atendimentos/novo', component: AtendimentoComponent, canActivate: [AuthGuard]},
  { path: 'atendimentos/editar/:id', component: AtendimentoComponent, canActivate: [AuthGuard]},
  { path: 'atendimentos/retornos', component: RetornoComponent, canActivate: [AuthGuard]},
  { path: 'atendimentos/retornos/novo', component: NovoRetornoComponent, canActivate: [AuthGuard]},
  { path: 'atendimentos/retornos/editar/:id', component: EditarRetornoComponent, canActivate: [AuthGuard]},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  { path: 'permissoes', component: PermissaoComponent, canActivate: [AuthGuard]},
  { path: 'movimentos/vendas', component: VendaComponent, canActivate: [AuthGuard]},
  { path: 'movimentos/vendas/novo', component: NovoVendaComponent, canActivate: [AuthGuard]},
  { path: 'movimentos/vendas/editar/:id', component: EditarVendaComponent, canActivate: [AuthGuard]},
  { path: 'produtos', component: ProdutoComponent, canActivate: [AuthGuard]},
  { path: 'produtos/novo', component: NovoProdutoComponent, canActivate: [AuthGuard]},
  { path: 'produtos/editar/:id', component: EditarProdutoComponent, canActivate: [AuthGuard]},
  { path: 'pessoas', component: PessoaComponent, canActivate: [AuthGuard]},
  { path: 'pessoas/novo', component: NovoPessoaComponent, canActivate: [AuthGuard]},
  { path: 'pessoas/editar/:id', component: EditarPessoaComponent, canActivate: [AuthGuard]},
  { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule]
})
export class AppRoutingModule { }
