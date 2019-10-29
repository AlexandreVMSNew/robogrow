import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CadastrarUsuarioComponent } from '../cadastros/usuario/cadastrarUsuario/cadastrarUsuario.component';
import { PermissaoService } from '../_services/Permissoes/permissao.service';
import { CadastrarClienteComponent } from '../cadastros/cliente/cadastrarCliente/cadastrarCliente.component';
import { EditarUsuarioComponent } from '../cadastros/usuario/editarUsuario/editarUsuario.component';
import { Permissao } from '../_models/Permissoes/permissao';
import { EditarClienteComponent } from '../cadastros/cliente/editarCliente/editarCliente.component';
import { PermissaoComponent } from '../configuracoes/permissao/permissao.component';
import { VendaComponent } from '../movimentos/venda/venda.component';
import { EditarVendaComponent } from '../movimentos/venda/editarVenda/editarVenda.component';
import { CadastrarVendaComponent } from '../movimentos/venda/cadastrarVenda/cadastrarVenda.component';
import { PessoaComponent } from '../cadastros/pessoa/pessoa.component';
import { EditarPessoaComponent } from '../cadastros/pessoa/editarPessoa/editarPessoa.component';
import { CadastrarPessoaComponent } from '../cadastros/pessoa/cadastrarPessoa/cadastrarPessoa.component';
import { ProdutoComponent } from '../cadastros/produto/produto.component';
import { CadastrarProdutoComponent } from '../cadastros/produto/cadastrarProduto/cadastrarProduto.component';
import { EditarProdutoComponent } from '../cadastros/produto/editarProduto/editarProduto.component';
import { PlanoContaComponent } from '../cadastros/planoConta/planoConta.component';
import { CentroReceitaComponent } from '../cadastros/centroReceita/centroReceita.component';
import { CentroDespesaComponent } from '../cadastros/centroDespesa/centroDespesa.component';
import { PlanoPagamentoComponent } from '../cadastros/planoPagamento/planoPagamento.component';
import { FormaPagamentoComponent } from '../cadastros/formaPagamento/formaPagamento.component';
import { RecebimentoComponent } from '../financeiro/recebimento/recebimento.component';
import { PagamentoComponent } from '../financeiro/pagamento/pagamento.component';
import { LancamentoComponent } from '../financeiro/lancamento/lancamento.component';
import { RelatorioLancamentoComponent } from '../financeiro/lancamento/relatorioLancamento/relatorioLancamento.component';
import { ChequePreComponent } from '../cadastros/chequePre/chequePre.component';
import { RelatorioVendaComponent } from '../movimentos/venda/relatorioVenda/relatorioVenda.component';
import { EmpresaComponent } from '../cadastros/empresa/empresa.component';
import { AutorizacaoComponent } from '../autorizacao/autorizacao.component';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  jwtHelper = new JwtHelperService();

  autorizado = false;

  constructor(private router: Router,
              private permissaoService: PermissaoService) {}


  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean  {

    const token = localStorage.getItem('token');
    if (token !== null && !this.jwtHelper.isTokenExpired(token) ) {
      /*if (next.component === CadastrarUsuarioComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto(
          Object.assign({formulario: 'USUARIOS', acao: 'CADASTRAR'})).subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissaoPorObjetos(_PERMISSAO);
          if (!this.autorizado) {
            return false;
          } else {
            return true;
          }
        });
      } else if (next.component === EditarUsuarioComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto(
          Object.assign({formulario: 'USUARIOS', acao: 'EDITAR'})).subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissaoPorObjetos(_PERMISSAO);
          if (!this.autorizado) {
            return false;
          } else {
            return true;
          }
        });

      } else if (next.component === CadastrarClienteComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto(
          Object.assign({formulario: 'CLIENTES', acao: 'CADASTRAR'})).subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissaoPorObjetos(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });

      } else if (next.component === EditarClienteComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto(
          Object.assign({formulario: 'CLIENTES', acao: 'EDITAR'})).subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissaoPorObjetos(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });

      } else if (next.component === PermissaoComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto(
          Object.assign({formulario: 'PERMISSOES', acao: 'LISTAR'})).subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissaoPorObjetos(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });
      } else if (next.component === EditarVendaComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto(
          Object.assign({formulario: 'VENDA', acao: 'EDITAR'})).subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissaoPorObjetos(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });
      } else if (next.component === CadastrarVendaComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto(
          Object.assign({formulario: 'VENDA', acao: 'CADASTRAR'})).subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissaoPorObjetos(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });
      } else if (next.component === VendaComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto(
          Object.assign({formulario: 'VENDA', acao: 'LISTAR'})).subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissaoPorObjetos(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });
      } else if (next.component === RelatorioVendaComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto(
          Object.assign({formulario: 'RELATÓRIOS VENDA', acao: 'LISTAR'})).subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissaoPorObjetos(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });
      } else if (next.component === PessoaComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto(
          Object.assign({formulario: 'PESSOAS', acao: 'LISTAR'})).subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissaoPorObjetos(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });
      } else if (next.component === EditarPessoaComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto(
          Object.assign({formulario: 'PESSOAS', acao: 'EDITAR'})).subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissaoPorObjetos(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });
      } else if (next.component === CadastrarPessoaComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto(
          Object.assign({formulario: 'PESSOAS', acao: 'CADASTRAR'})).subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissaoPorObjetos(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });
      } else if (next.component === ProdutoComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto(
          Object.assign({formulario: 'PRODUTOS', acao: 'LISTAR'})).subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissaoPorObjetos(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });
      } else if (next.component === CadastrarProdutoComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto(
          Object.assign({formulario: 'PRODUTOS', acao: 'CADASTRAR'})).subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissaoPorObjetos(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });
      } else if (next.component === EditarProdutoComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto(
          Object.assign({formulario: 'PRODUTOS', acao: 'EDITAR'})).subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissaoPorObjetos(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });
      } else if (next.component === PlanoContaComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto(
          Object.assign({formulario: 'PLANO DE CONTAS', acao: 'LISTAR'})).subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissaoPorObjetos(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });
      } else if (next.component === CentroReceitaComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto(
          Object.assign({formulario: 'CENTRO DE RECEITA', acao: 'LISTAR'})).subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissaoPorObjetos(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });
      } else if (next.component === CentroDespesaComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto(
          Object.assign({formulario: 'CENTRO DE DESPESA', acao: 'LISTAR'})).subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissaoPorObjetos(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });
      } else if (next.component === PlanoPagamentoComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto(
          Object.assign({formulario: 'PLANO DE PAGAMENTO', acao: 'LISTAR'})).subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissaoPorObjetos(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });
      } else if (next.component === FormaPagamentoComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto(
          Object.assign({formulario: 'FORMA DE PAGAMENTO', acao: 'LISTAR'})).subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissaoPorObjetos(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });
      } else if (next.component === RecebimentoComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto(
          Object.assign({formulario: 'RECEBIMENTOS', acao: 'LISTAR'})).subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissaoPorObjetos(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });
      } else if (next.component === PagamentoComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto(
          Object.assign({formulario: 'PAGAMENTOS', acao: 'LISTAR'})).subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissaoPorObjetos(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });
      } else if (next.component === LancamentoComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto(
          Object.assign({formulario: 'LANÇAMENTOS', acao: 'LISTAR'})).subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissaoPorObjetos(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });
      } else if (next.component === RelatorioLancamentoComponent) {

        // tslint:disable-next-line:max-line-length
        this.permissaoService.getPermissoesByFormularioAcaoObjeto(
          Object.assign({formulario: 'RELATÓRIOS LANÇAMENTOS', acao: 'LISTAR'})).subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissaoPorObjetos(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });
      } else if (next.component === ChequePreComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto(
          Object.assign({formulario: 'CHEQUES PRE-DATADO', acao: 'LISTAR'})).subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissaoPorObjetos(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });
      } else if (next.component === EmpresaComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto(
          Object.assign({formulario: 'EMPRESAS', acao: 'LISTAR'})).subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissaoPorObjetos(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });
      } else if (next.component === AutorizacaoComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto(
          Object.assign({formulario: 'AUTORIZACOES', acao: 'LISTAR'})).subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissaoPorObjetos(_PERMISSAO);
          if (!this.autorizado) {
            return false;
          } else {
            return true;
          }
        });
      }*/

      return true;
    } else {
      this.router.navigate(
        Object.assign({formulario: '/usuarios/login'}));
      return false;
    }
  }
}
