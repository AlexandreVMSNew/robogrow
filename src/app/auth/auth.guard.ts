import { Injectable } from '@angular/core';
import { CanActivate,  ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NovoUsuarioComponent } from '../cadastros/usuario/novoUsuario/novoUsuario.component';
import { PermissaoService } from '../_services/Permissoes/permissao.service';
import { NovoClienteComponent } from '../cadastros/cliente/novoCliente/novoCliente.component';
import { EditarUsuarioComponent } from '../cadastros/usuario/editarUsuario/editarUsuario.component';
import { Permissao } from '../_models/Permissoes/permissao';
import { EditarClienteComponent } from '../cadastros/cliente/editarCliente/editarCliente.component';
import { PermissaoComponent } from '../permissao/permissao.component';
import { VendaComponent } from '../movimentos/venda/venda.component';
import { EditarVendaComponent } from '../movimentos/venda/editarVenda/editarVenda.component';
import { NovoVendaComponent } from '../movimentos/venda/novoVenda/novoVenda.component';
import { PessoaComponent } from '../cadastros/pessoa/pessoa.component';
import { EditarPessoaComponent } from '../cadastros/pessoa/editarPessoa/editarPessoa.component';
import { NovoPessoaComponent } from '../cadastros/pessoa/novoPessoa/novoPessoa.component';
import { ProdutoComponent } from '../cadastros/produto/produto.component';
import { NovoProdutoComponent } from '../cadastros/produto/novoProduto/novoProduto.component';
import { EditarProdutoComponent } from '../cadastros/produto/editarProduto/editarProduto.component';

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
      if (next.component === NovoUsuarioComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto('USUARIOS', 'NOVO').subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissao(_PERMISSAO);
          if (!this.autorizado) {
            return false;
          } else {
            return true;
          }
        });
      } else if (next.component === EditarUsuarioComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto('USUARIOS', 'EDITAR').subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissao(_PERMISSAO);
          if (!this.autorizado) {
            return false;
          } else {
            return true;
          }
        });

      } else if (next.component === NovoClienteComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto('CLIENTES', 'NOVO').subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissao(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });

      } else if (next.component === EditarClienteComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto('CLIENTES', 'EDITAR').subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissao(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });

      } else if (next.component === PermissaoComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto('PERMISSOES', 'LISTAR').subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissao(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });
      } else if (next.component === EditarVendaComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto('VENDA', 'EDITAR').subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissao(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });
      } else if (next.component === NovoVendaComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto('VENDA', 'NOVO').subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissao(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });
      } else if (next.component === VendaComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto('VENDA', 'LISTAR').subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissao(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });
      } else if (next.component === PessoaComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto('PESSOAS', 'LISTAR').subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissao(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });
      } else if (next.component === EditarPessoaComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto('PESSOAS', 'EDITAR').subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissao(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });
      } else if (next.component === NovoPessoaComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto('PESSOAS', 'NOVO').subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissao(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });
      } else if (next.component === ProdutoComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto('PRODUTOS', 'LISTAR').subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissao(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });
      } else if (next.component === NovoProdutoComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto('PRODUTOS', 'NOVO').subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissao(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });
      } else if (next.component === EditarProdutoComponent) {

        this.permissaoService.getPermissoesByFormularioAcaoObjeto('PRODUTOS', 'EDITAR').subscribe((_PERMISSAO: Permissao) => {
          this.autorizado = this.permissaoService.verificarPermissao(_PERMISSAO);
          if (!this.autorizado) {
              return false;
            } else {
              return true;
            }
        });
      }

      return true;
    } else {
      this.router.navigate(['/usuarios/login']);
      return false;
    }
  }
}
