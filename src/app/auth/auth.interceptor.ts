import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({providedIn: 'root'})
export class AuthInterceptor implements HttpInterceptor {
    jwtHelper = new JwtHelperService();

    constructor(private router: Router) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('token');
        if (token !== null && !this.jwtHelper.isTokenExpired(token)) {
            const cloneReq = req.clone({
                setHeaders: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            });

            return next.handle(cloneReq).pipe(
                tap(
                    succ => {},
                    err => {
                        console.log(err);
                        if (err.status === 401) {
                            //this.router.navigateByUrl('usuarios/login');
                        }
                    }
                )
            );
          } else {
            //this.router.navigate(['/usuarios/login']);
            console.log('teste 1');
            return next.handle(req.clone());
          }
    }
}
