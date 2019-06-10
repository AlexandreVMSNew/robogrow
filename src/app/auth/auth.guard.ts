import { Injectable } from '@angular/core';
import { CanActivate,  ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NovoUsuarioComponent } from '../usuario/novoUsuario/novoUsuario.component';
import { PermissaoService } from '../_services/Permissoes/permissao.service';
import { NovoClienteComponent } from '../cliente/novoCliente/novoCliente.component';
import { EditarUsuarioComponent } from '../usuario/editarUsuario/editarUsuario.component';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  jwtHelper = new JwtHelperService();
  constructor(private router: Router,
              private permissaoService: PermissaoService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean  {

    const token = localStorage.getItem('token');
    if (token !== null && !this.jwtHelper.isTokenExpired(token) ) {
      if (next.component === NovoUsuarioComponent) {
        if (!this.permissaoService.verificaPermissao(['DIRETOR'])) {
          return false;
        }
      } else if (next.component === EditarUsuarioComponent) {
        if (!this.permissaoService.verificaPermissao(['DIRETOR']) &&
             this.permissaoService.getUsuarioId() !== next.params.id) {
          return false;
        }
      } else if (next.component === NovoClienteComponent) {
        if (!this.permissaoService.verificaPermissao(['DIRETOR', 'COMERCIAL'])) {
          return false;
        }
      }

      return true;
    } else {
      this.router.navigate(['/usuarios/login']);
      return false;
    }
  }
}
