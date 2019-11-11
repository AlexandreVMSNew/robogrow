import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_services/Cadastros/Login/auth.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SpinnerService } from 'src/app/_services/Uteis/Spinner/spinner.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewChecked {

  titulo = 'Login';
  model: any = {};
  jwtHelper = new JwtHelperService();

  constructor(public fb: FormBuilder,
              private toastr: ToastrService,
              private authService: AuthService,
              private spinnerService: SpinnerService,
              public router: Router,
              private changeDetectionRef: ChangeDetectorRef) {
              }

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token != null && !this.jwtHelper.isTokenExpired(token)) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngAfterViewChecked() {
    this.changeDetectionRef.detectChanges();
  }

  login() {
    this.spinnerService.alterarSpinnerStatus(true);
    this.authService.login(this.model)
        .subscribe(
          () => {
            this.spinnerService.alterarSpinnerStatus(false);
            this.router.navigate(['/dashboard']);
          },
          error => {
            this.spinnerService.alterarSpinnerStatus(false);
            this.toastr.error(`Usuário ou senha incorreto(s).`, '', {
              positionClass: 'toast-bottom-right',
            });
          }
        );
  }

}
