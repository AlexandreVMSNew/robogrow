import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  jwtHelper = new JwtHelperService();
  constructor(private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean  {
    const token = localStorage.getItem('token');
    if (token !== null && !this.jwtHelper.isTokenExpired(token) ) {
      return true;
    } else {
      this.router.navigate(['/colaboradores/login']);
      return false;
    }
  }
}
