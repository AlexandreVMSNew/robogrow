import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { ColaboradorComponent } from './colaborador/colaborador.component';
import { LoginComponent } from './colaborador/login/login.component';
import { NovoColaboradorComponent } from './colaborador/novoColaborador/novoColaborador.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditarColaboradorComponent } from './colaborador/editarColaborador/editarColaborador.component';
import { ClienteComponent } from './cliente/cliente.component';
import { NovoClienteComponent } from './cliente/novoCliente/novoCliente.component';
import { EditarClienteComponent } from './cliente/editarCliente/editarCliente.component';

const routes: Routes = [
  { path: 'colaboradores', component: ColaboradorComponent, canActivate: [AuthGuard]},
  { path: 'colaboradores/login', component: LoginComponent},
  { path: 'colaboradores/novo', component: NovoColaboradorComponent},
  { path: 'colaboradores/editar/:id', component: EditarColaboradorComponent, canActivate: [AuthGuard]},
  { path: 'clientes', component: ClienteComponent, canActivate: [AuthGuard]},
  { path: 'clientes/novo', component: NovoClienteComponent, canActivate: [AuthGuard]},
  { path: 'clientes/editar/:id', component: EditarClienteComponent, canActivate: [AuthGuard]},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule]
})
export class AppRoutingModule { }
