import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { ModalModule, TooltipModule, BsDropdownModule, BsDatepickerModule, TabsModule  } from 'ngx-bootstrap';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxMaskModule } from 'ngx-mask';
import { NgxCurrencyModule } from 'ngx-currency';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { NgDatepickerModule } from 'ng2-datepicker';
import { ChartsModule } from 'ng2-charts';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import {MatDialogModule} from '@angular/material';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

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
import { PagamentosVendaComponent } from './movimentos/venda/editarVenda/pagamentosVenda/pagamentosVenda.component';
import { ConfigVendaComponent } from './movimentos/venda/configVenda/configVenda.component';

import { ProdutoComponent } from './cadastros/produto/produto.component';
import { NovoProdutoComponent } from './cadastros/produto/novoProduto/novoProduto.component';
import { EditarProdutoComponent } from './cadastros/produto/editarProduto/editarProduto.component';

import { PlanoContaComponent } from './cadastros/planoConta/planoConta.component';

import { CentroDespesaComponent } from './cadastros/centroDespesa/centroDespesa.component';
import { CentroReceitaComponent } from './cadastros/centroReceita/centroReceita.component';

import { FormaPagamentoComponent } from './cadastros/formaPagamento/formaPagamento.component';
import { PlanoPagamentoComponent } from './cadastros/planoPagamento/planoPagamento.component';

import { PessoaComponent } from './cadastros/pessoa/pessoa.component';
import { NovoPessoaComponent } from './cadastros/pessoa/novoPessoa/novoPessoa.component';
import { EditarPessoaComponent } from './cadastros/pessoa/editarPessoa/editarPessoa.component';

import { RecebimentoComponent } from './financeiro/recebimento/recebimento.component';
import { DetalharRecebimentoComponent } from './financeiro/recebimento/detalharRecebimento/detalharRecebimento.component';
import { TemplateRecebimentoComponent } from './financeiro/recebimento/templateRecebimento/templateRecebimento.component';

import { PagamentoComponent } from './financeiro/pagamento/pagamento.component';
import { TemplatePagamentoComponent } from './financeiro/pagamento/templatePagamento/templatePagamento.component';
import { DetalharPagamentoComponent } from './financeiro/pagamento/detalharPagamento/detalharPagamento.component';

import { LancamentoComponent } from './financeiro/lancamento/lancamento.component';
import { LancamentoTemplateComponent } from './financeiro/lancamento/lancamentoTemplate/lancamentoTemplate.component';
import { RelatorioLancamentoComponent } from './financeiro/lancamento/relatorioLancamento/relatorioLancamento.component';

import { ChequePreComponent } from './cadastros/chequePre/chequePre.component';
import { ChequePreTemplateComponent } from './cadastros/chequePre/chequePreTemplate/chequePreTemplate.component';

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

const config: SocketIoConfig = { url: location.protocol + '//' + location.hostname + ':3000', options: {}  };
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
      ConfigVendaComponent,
      PagamentosVendaComponent,
      ProdutoComponent,
      NovoProdutoComponent,
      EditarProdutoComponent,
      PessoaComponent,
      NovoPessoaComponent,
      EditarPessoaComponent,
      PlanoContaComponent,
      CentroDespesaComponent,
      CentroReceitaComponent,
      FormaPagamentoComponent,
      PlanoPagamentoComponent,
      RecebimentoComponent,
      DetalharRecebimentoComponent,
      TemplateRecebimentoComponent,
      PagamentoComponent,
      TemplatePagamentoComponent,
      DetalharPagamentoComponent,
      LancamentoComponent,
      LancamentoTemplateComponent,
      RelatorioLancamentoComponent,
      ChequePreComponent,
      ChequePreTemplateComponent,
      CnpjCpfPipe,
      CelularPipe,
      CepPipe,
      IePipe
   ],
   imports: [
      BrowserAnimationsModule,
      BrowserModule,
      MatDialogModule,
      NoopAnimationsModule,
      SocketIoModule.forRoot(config),
      BsDropdownModule.forRoot(),
      BsDatepickerModule.forRoot(),
      TooltipModule.forRoot(),
      TabsModule.forRoot(),
      ModalModule.forRoot(),
      NgxMaskModule.forRoot(),
      NgDatepickerModule,
      ChartsModule,
      PerfectScrollbarModule,
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
      {
         provide: PERFECT_SCROLLBAR_CONFIG,
         useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
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
