import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { UsuarioComponent } from './cadastros/usuario/usuario.component';
import { LoginComponent } from './cadastros/usuario/login/login.component';
import { CadastrarUsuarioComponent } from './cadastros/usuario/cadastrarUsuario/cadastrarUsuario.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditarUsuarioComponent } from './cadastros/usuario/editarUsuario/editarUsuario.component';
import { EditarSenhaUsuarioComponent } from './cadastros/usuario/editarSenhaUsuario/editarSenhaUsuario.component';
import { PermissaoComponent } from './configuracoes/permissao/permissao.component';
import { ProdutoComponent } from './cadastros/produto/produto.component';
import { CadastrarProdutoComponent } from './cadastros/produto/cadastrarProduto/cadastrarProduto.component';
import { EditarProdutoComponent } from './cadastros/produto/editarProduto/editarProduto.component';
import { TimelineComponent } from './timeline/timeline/timeline.component';
import { PainelControleComponent } from './painel-controle/painel-controle.component';

export const routes: Routes = [
  { path: 'usuarios', component: UsuarioComponent, canActivate: [AuthGuard]},
  { path: 'usuarios/login', component: LoginComponent},
  { path: 'usuarios/cadastrar', component: CadastrarUsuarioComponent},
  { path: 'usuarios/editar/:id', component: EditarUsuarioComponent, canActivate: [AuthGuard]},
  { path: 'usuarios/editar/senha/:id', component: EditarSenhaUsuarioComponent, canActivate: [AuthGuard]},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  { path: 'permissoes', component: PermissaoComponent, canActivate: [AuthGuard]},
  { path: 'produtos', component: ProdutoComponent, canActivate: [AuthGuard]},
  { path: 'produtos/cadastrar', component: CadastrarProdutoComponent, canActivate: [AuthGuard]},
  { path: 'produtos/editar/:id', component: EditarProdutoComponent, canActivate: [AuthGuard]},
  { path: 'painel-controle', component: PainelControleComponent, canActivate: [AuthGuard]},
  { path: 'timeline', component: TimelineComponent, canActivate: [AuthGuard]},
  { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule]
})
export class AppRoutingModule { }
