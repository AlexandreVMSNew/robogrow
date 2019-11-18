import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule, routes } from './app-routing.module';
// tslint:disable-next-line:max-line-length
import { ModalModule, TooltipModule, BsDropdownModule, BsDatepickerModule, TabsModule, PopoverModule, BsDatepickerConfig  } from 'ngx-bootstrap';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxMaskModule } from 'ngx-mask';
import { NgxCurrencyModule } from 'ngx-currency';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { NgxPaginationModule } from 'ngx-pagination';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { NgDatepickerModule } from 'ng2-datepicker';
import { ChartsModule } from 'ng2-charts';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import {MatDialogModule, MatCheckboxModule, MatRadioModule, MatDividerModule} from '@angular/material';
import {NgxFilesizeModule} from 'ngx-filesize';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RouterModule } from '@angular/router';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';

import { UsuarioComponent } from './cadastros/usuario/usuario.component';
import { LoginComponent } from './cadastros/usuario/login/login.component';
import { EditarUsuarioComponent } from './cadastros/usuario/editarUsuario/editarUsuario.component';
import { CadastrarUsuarioComponent } from './cadastros/usuario/cadastrarUsuario/cadastrarUsuario.component';
import { EditarSenhaUsuarioComponent } from './cadastros/usuario/editarSenhaUsuario/editarSenhaUsuario.component';

import { ClienteComponent } from './cadastros/cliente/cliente.component';
import { CadastrarClienteComponent } from './cadastros/cliente/cadastrarCliente/cadastrarCliente.component';
import { EditarClienteComponent } from './cadastros/cliente/editarCliente/editarCliente.component';

import { DashboardComponent } from './dashboard/dashboard.component';

import { AtendimentoComponent } from './atendimento/atendimento.component';
import { RetornoComponent } from './atendimento/retorno/retorno.component';
import { CadastrarRetornoComponent } from './atendimento/retorno/cadastrarRetorno/cadastrarRetorno.component';
import { EditarRetornoComponent } from './atendimento/retorno/editarRetorno/editarRetorno.component';

import { VendaComponent } from './movimentos/venda/venda.component';
import { CadastrarVendaComponent } from './movimentos/venda/cadastrarVenda/cadastrarVenda.component';
import { EditarVendaComponent } from './movimentos/venda/editarVenda/editarVenda.component';
import { ResultadoVendaComponent } from './movimentos/venda/editarVenda/resultadoVenda/resultadoVenda.component';
import { PagamentosVendaComponent } from './movimentos/venda/editarVenda/financeiroVenda/pagamentosVenda/pagamentosVenda.component';
import { RecebimentosVendaComponent } from './movimentos/venda/editarVenda/financeiroVenda/recebimentosVenda/recebimentosVenda.component';
import { ConfigVendaComponent } from './movimentos/venda/configVenda/configVenda.component';
import { RelatorioVendaComponent } from './movimentos/venda/relatorioVenda/relatorioVenda.component';
import { CheckListVendaComponent } from './movimentos/venda/editarVenda/checkListVenda/checkListVenda.component';
import { FinanceiroVendaComponent } from './movimentos/venda/editarVenda/financeiroVenda/financeiroVenda.component';
import { PrevisaoVendaComponent } from './movimentos/venda/editarVenda/financeiroVenda/previsaoVenda/previsaoVenda.component';
import { PedidoVendaComponent } from './movimentos/venda/editarVenda/pedidoVenda/pedidoVenda.component';
import { LogsStatusVendaComponent } from './movimentos/venda/editarVenda/logsStatusVenda/logsStatusVenda.component';
import { VendaStatusCadastroComponent } from './movimentos/venda/configVenda/vendaStatusCadastro/vendaStatusCadastro.component';

import { ProdutoComponent } from './cadastros/produto/produto.component';
import { CadastrarProdutoComponent } from './cadastros/produto/cadastrarProduto/cadastrarProduto.component';
import { EditarProdutoComponent } from './cadastros/produto/editarProduto/editarProduto.component';
import { CheckListProdutoComponent } from './cadastros/produto/editarProduto/checkListProduto/checkListProduto.component';
import { TemplateProdutoItensComponent } from './cadastros/produto/editarProduto/templateProdutoItens/templateProdutoItens.component';

import { PlanoContaComponent } from './cadastros/planoConta/planoConta.component';

import { CentroDespesaComponent } from './cadastros/centroDespesa/centroDespesa.component';
import { CentroReceitaComponent } from './cadastros/centroReceita/centroReceita.component';

import { FormaPagamentoComponent } from './cadastros/formaPagamento/formaPagamento.component';
import { PlanoPagamentoComponent } from './cadastros/planoPagamento/planoPagamento.component';

import { PessoaComponent } from './cadastros/pessoa/pessoa.component';
import { CadastrarPessoaComponent } from './cadastros/pessoa/cadastrarPessoa/cadastrarPessoa.component';
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

import { PermissaoComponent } from './configuracoes/permissao/permissao.component';
import { EditarPermissaoComponent } from './configuracoes/permissao/editarPermissao/editarPermissao.component';
// tslint:disable-next-line:max-line-length
import { TemplatePermissaoObjetoComponent } from './configuracoes/permissao/editarPermissao/templatePermissaoObjeto/templatePermissaoObjeto.component';

import { EmpresaComponent } from './cadastros/empresa/empresa.component';
import { EmpresaTemplateComponent } from './cadastros/empresa/empresaTemplate/empresaTemplate.component';

import { AutorizacaoComponent } from './autorizacao/autorizacao.component';
import { AutorizacaoTemplateComponent } from './autorizacao/autorizacaoTemplate/autorizacaoTemplate.component';

import { TemplateModalComponent } from './Uteis/templateModal/templateModal.component';

import { PublicacaoTemplateComponent } from './timeline/publicacao/publicacaoTemplate/publicacaoTemplate.component';
import { PublicacaoInteracaoComponent } from './timeline/publicacao/publicacaoInteracao/publicacaoInteracao.component';

import { DateInputComponent } from './Uteis/DateInput/DateInput.component';

import { GraficoBarChartComponent } from './Uteis/graficoBarChart/graficoBarChart.component';
import { GraficoPieChartComponent } from './Uteis/graficoPieChart/graficoPieChart.component';
import { GraficoLineChartComponent } from './Uteis/graficoLineChart/graficoLineChart.component';

import { TimelineComponent } from './timeline/timeline/timeline.component';

import { TarefasComponent } from './tarefas/tarefas.component';
import { TarefaCadastroComponent } from './tarefas/tarefaCadastro/tarefaCadastro.component';

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

export function getDatepickerConfig(): BsDatepickerConfig {
   return Object.assign(new BsDatepickerConfig(), {
      containerClass: 'theme-dark-blue',
      maxDate: new Date()
   });
 }
const config: SocketIoConfig = { url: location.protocol + '//' + location.hostname + '', options: {}  };
registerLocaleData(localePt, LOCALE_ID);
defineLocale('pt-br', ptBrLocale);

@NgModule({
   entryComponents: [
      TemplateModalComponent,
      PrevisaoVendaComponent,
      RecebimentosVendaComponent,
      PagamentosVendaComponent,
      EditarPermissaoComponent,
      TemplatePermissaoObjetoComponent,
      DetalharRecebimentoComponent,
      TemplateRecebimentoComponent,
      DetalharPagamentoComponent,
      TemplatePagamentoComponent,
      LogsStatusVendaComponent,
      AutorizacaoTemplateComponent,
      PublicacaoTemplateComponent,
      PublicacaoInteracaoComponent,
      ConfigVendaComponent,
      TimelineComponent,
      VendaStatusCadastroComponent,
      TarefaCadastroComponent
   ],
   declarations: [
      AppComponent,
      UsuarioComponent,
      LoginComponent,
      CadastrarUsuarioComponent,
      EditarUsuarioComponent,
      EditarSenhaUsuarioComponent,
      DashboardComponent,
      ClienteComponent,
      CadastrarClienteComponent,
      EditarClienteComponent,
      AtendimentoComponent,
      RetornoComponent,
      CadastrarRetornoComponent,
      EditarRetornoComponent,
      PermissaoComponent,
      VendaComponent,
      CadastrarVendaComponent,
      EditarVendaComponent,
      ResultadoVendaComponent,
      ConfigVendaComponent,
      RelatorioVendaComponent,
      PagamentosVendaComponent,
      RecebimentosVendaComponent,
      CheckListVendaComponent,
      FinanceiroVendaComponent,
      PrevisaoVendaComponent,
      PedidoVendaComponent,
      ProdutoComponent,
      CadastrarProdutoComponent,
      EditarProdutoComponent,
      CheckListProdutoComponent,
      TemplateProdutoItensComponent,
      PessoaComponent,
      CadastrarPessoaComponent,
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
      EmpresaComponent,
      EmpresaTemplateComponent,
      AutorizacaoComponent,
      AutorizacaoTemplateComponent,
      TemplateModalComponent,
      PublicacaoTemplateComponent,
      DateInputComponent,
      GraficoBarChartComponent,
      GraficoPieChartComponent,
      GraficoLineChartComponent,
      EditarPermissaoComponent,
      TemplatePermissaoObjetoComponent,
      LogsStatusVendaComponent,
      PublicacaoInteracaoComponent,
      TimelineComponent,
      VendaStatusCadastroComponent,
      CnpjCpfPipe,
      CelularPipe,
      CepPipe,
      IePipe,
      TarefasComponent,
      TarefaCadastroComponent
   ],
   imports: [
      BrowserAnimationsModule,
      BrowserModule,
      MatDialogModule,
      MatCheckboxModule,
      MatRadioModule,
      MatDividerModule,
      NgOptionHighlightModule,
      NoopAnimationsModule,
      NgxSpinnerModule,
      SocketIoModule.forRoot(config),
      BsDropdownModule.forRoot(),
      BsDatepickerModule.forRoot(),
      NgxDaterangepickerMd.forRoot(),
      TooltipModule.forRoot(),
      TabsModule.forRoot(),
      ModalModule.forRoot(),
      NgxMaskModule.forRoot(),
      PopoverModule.forRoot(),
      NgxFilesizeModule,
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
   exports: [
      RouterModule
   ],
   providers: [
      {
         provide: BsDatepickerConfig,
         useFactory: getDatepickerConfig
      },
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
