import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { ModalModule, TooltipModule, BsDropdownModule, BsDatepickerModule, TabsModule  } from 'ngx-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxMaskModule } from 'ngx-mask';
import { NgxCurrencyModule } from 'ngx-currency';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { NgDatepickerModule } from 'ng2-datepicker';
import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { UsuarioComponent } from './cadastros/usuario/usuario.component';
import { LoginComponent } from './cadastros/usuario/login/login.component';
import { EditarUsuarioComponent } from './cadastros/usuario/editarUsuario/editarUsuario.component';
import { NovoUsuarioComponent } from './cadastros/usuario/novoUsuario/novoUsuario.component';
import { EditarSenhaUsuarioComponent } from './cadastros/usuario/editarSenhaUsuario/editarSenhaUsuario.component';
import { ClienteComponent } from './cadastros/cliente/cliente.component';
import { NovoClienteComponent } from './cadastros/cliente/novoCliente/novoCliente.component';
import { EditarClienteComponent } from './cadastros/cliente/editarCliente/editarCliente.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AtendimentoComponent } from './atendimento/atendimento.component';
import { RetornoComponent } from './atendimento/retorno/retorno.component';
import { NovoRetornoComponent } from './atendimento/retorno/novoRetorno/novoRetorno.component';
import { EditarRetornoComponent } from './atendimento/retorno/editarRetorno/editarRetorno.component';
import { VendaComponent } from './movimentos/venda/venda.component';
import { NovoVendaComponent } from './movimentos/venda/novoVenda/novoVenda.component';
import { EditarVendaComponent } from './movimentos/venda/editarVenda/editarVenda.component';
import { ResumoVendaComponent } from './movimentos/venda/editarVenda/resumoVenda/resumoVenda.component';
import { ProdutoComponent } from './cadastros/produto/produto.component';
import { NovoProdutoComponent } from './cadastros/produto/novoProduto/novoProduto.component';
import { EditarProdutoComponent } from './cadastros/produto/editarProduto/editarProduto.component';

import { PessoaComponent } from './cadastros/pessoa/pessoa.component';
import { NovoPessoaComponent } from './cadastros/pessoa/novoPessoa/novoPessoa.component';
import { EditarPessoaComponent } from './cadastros/pessoa/editarPessoa/editarPessoa.component';

import { CnpjCpfPipe } from './pipes/cnpjCpf.pipe';
import { CelularPipe } from './pipes/celular.pipe';
import { CepPipe } from './pipes/cep.pipe';
import { IePipe } from './pipes/ie.pipe';

import { LOCALE_ID } from '@angular/core';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';

import { APP_BASE_HREF } from '@angular/common';
import { AuthInterceptor } from './auth/auth.interceptor';
import { ClienteService } from './_services/Cadastros/Clientes/cliente.service';
import { SocketService } from './_services/WebSocket/Socket.service';
import { PermissaoComponent } from './permissao/permissao.component';

const config: SocketIoConfig = { url: location.protocol + '//' + location.hostname + '', options: {}  };
registerLocaleData(localePt, LOCALE_ID);
defineLocale('pt-br', ptBrLocale);

@NgModule({
   declarations: [
      AppComponent,
      UsuarioComponent,
      LoginComponent,
      NovoUsuarioComponent,
      EditarUsuarioComponent,
      EditarSenhaUsuarioComponent,
      DashboardComponent,
      ClienteComponent,
      NovoClienteComponent,
      EditarClienteComponent,
      AtendimentoComponent,
      RetornoComponent,
      NovoRetornoComponent,
      EditarRetornoComponent,
      PermissaoComponent,
      VendaComponent,
      NovoVendaComponent,
      EditarVendaComponent,
      ResumoVendaComponent,
      ProdutoComponent,
      NovoProdutoComponent,
      EditarProdutoComponent,
      PessoaComponent,
      NovoPessoaComponent,
      EditarPessoaComponent,
      CnpjCpfPipe,
      CelularPipe,
      CepPipe,
      IePipe
   ],
   imports: [
      BrowserAnimationsModule,
      BrowserModule,
      SocketIoModule.forRoot(config),
      BsDropdownModule.forRoot(),
      BsDatepickerModule.forRoot(),
      TooltipModule.forRoot(),
      TabsModule.forRoot(),
      ModalModule.forRoot(),
      NgxMaskModule.forRoot(),
      NgDatepickerModule,
      ChartsModule,
      NgxPaginationModule,
      NgxCurrencyModule,
      NgSelectModule,
      ToastrModule.forRoot(),
      AppRoutingModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'})
   ],
   providers: [
      {
         provide: LOCALE_ID,
         useValue: 'pt-BR'
      },
      {
         provide: APP_BASE_HREF,
          useValue: '/'
      },
      ClienteService,
      {
         provide: HTTP_INTERCEPTORS,
         useClass: AuthInterceptor,
         multi: true
      },
      SocketService
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
