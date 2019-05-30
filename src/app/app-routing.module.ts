import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { UsuarioComponent } from './usuario/usuario.component';
import { LoginComponent } from './usuario/login/login.component';
import { NovoUsuarioComponent } from './usuario/novoUsuario/novoUsuario.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditarUsuarioComponent } from './usuario/editarUsuario/editarUsuario.component';
import { ClienteComponent } from './cliente/cliente.component';
import { NovoClienteComponent } from './cliente/novoCliente/novoCliente.component';
import { EditarClienteComponent } from './cliente/editarCliente/editarCliente.component';
import { AtendimentoComponent } from './atendimento/atendimento.component';
import { RetornoComponent } from './atendimento/retorno/retorno.component';
import { NovoRetornoComponent } from './atendimento/retorno/novoRetorno/novoRetorno.component';
import { EditarRetornoComponent } from './atendimento/retorno/editarRetorno/editarRetorno.component';
import { EditarSenhaUsuarioComponent } from './usuario/EditarSenhaUsuario/editarSenhaUsuario.component';

const routes: Routes = [
  { path: 'usuarios', component: UsuarioComponent, canActivate: [AuthGuard]},
  { path: 'usuarios/login', component: LoginComponent},
  { path: 'usuarios/novo', component: NovoUsuarioComponent},
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
  { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule]
})
export class AppRoutingModule { }
