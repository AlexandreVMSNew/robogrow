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

import { DashboardComponent } from './dashboard/dashboard.component';


import { ProdutoComponent } from './cadastros/produto/produto.component';
import { CadastrarProdutoComponent } from './cadastros/produto/cadastrarProduto/cadastrarProduto.component';
import { EditarProdutoComponent } from './cadastros/produto/editarProduto/editarProduto.component';

import { PermissaoComponent } from './configuracoes/permissao/permissao.component';
import { EditarPermissaoComponent } from './configuracoes/permissao/editarPermissao/editarPermissao.component';
// tslint:disable-next-line:max-line-length
import { TemplatePermissaoObjetoComponent } from './configuracoes/permissao/editarPermissao/templatePermissaoObjeto/templatePermissaoObjeto.component';

import { TemplateModalComponent } from './Uteis/templateModal/templateModal.component';

import { DateInputComponent } from './Uteis/DateInput/DateInput.component';

import { GraficoBarChartComponent } from './Uteis/graficoBarChart/graficoBarChart.component';
import { GraficoPieChartComponent } from './Uteis/graficoPieChart/graficoPieChart.component';
import { GraficoLineChartComponent } from './Uteis/graficoLineChart/graficoLineChart.component';

import { TimelineComponent } from './timeline/timeline/timeline.component';

import { TempUmidComponent } from './Monitoramentos/tempUmid/tempUmid.component';

import { PainelControleComponent } from './painel-controle/painel-controle.component';

import { CoolerComponent } from './painel-controle/cooler/cooler.component';
import { CoolerCadastroComponent } from './painel-controle/cooler/coolerCadastro/coolerCadastro.component';

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
      EditarPermissaoComponent,
      TemplatePermissaoObjetoComponent,
      TimelineComponent,
      CoolerCadastroComponent
   ],
   declarations: [
      AppComponent,
      UsuarioComponent,
      LoginComponent,
      CadastrarUsuarioComponent,
      EditarUsuarioComponent,
      EditarSenhaUsuarioComponent,
      DashboardComponent,
      PermissaoComponent,
      ProdutoComponent,
      CadastrarProdutoComponent,
      EditarProdutoComponent,
      TemplateModalComponent,
      DateInputComponent,
      GraficoBarChartComponent,
      GraficoPieChartComponent,
      GraficoLineChartComponent,
      EditarPermissaoComponent,
      TemplatePermissaoObjetoComponent,
      TimelineComponent,
      TempUmidComponent,
      CnpjCpfPipe,
      CelularPipe,
      CepPipe,
      IePipe,
      PainelControleComponent,
      CoolerComponent,
      CoolerCadastroComponent
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
      ReactiveFormsModule.withConfig(({warnOnNgModelWithFormControl: 'never'})),
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
