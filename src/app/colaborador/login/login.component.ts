import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_services/auth.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  titulo = 'Login';
  model: any = {};
  jwtHelper = new JwtHelperService();

  constructor(public fb: FormBuilder,
              private toastr: ToastrService,
              private authService: AuthService,
              public router: Router) {
              }

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token != null && !this.jwtHelper.isTokenExpired(token)) {
      this.router.navigate(['/dashboard']);
    }
  }

  login() {
    this.authService.login(this.model)
        .subscribe(
          () => {
            this.router.navigate(['/dashboard']);
          },
          error => {
            this.toastr.error(`Usuário ou senha incorreto(s).`);
          }
        );
  }

}
