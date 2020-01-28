import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { PermissaoService } from '../_services/Permissoes/permissao.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  jwtHelper = new JwtHelperService();

  autorizado = false;

  constructor(private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean  {

    const token = localStorage.getItem('token');
    if (token !== null ) {
      return true;
    } else {
      this.router.navigate(Object.assign({formulario: '/usuarios/login'}));
      return false;
    }
  }
}
