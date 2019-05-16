import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../_services/Cadastros/Login/auth.service';
import { Router } from '@angular/router';
import { InfoColaborador } from '../_models/Info/infoColaborador';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private toastr: ToastrService,
              public authService: AuthService,
              private router: Router) { }

  ngOnInit() {
  }

  loggedIn() {
    return this.authService.loggerIn();
  }

  logout() {
    localStorage.removeItem('token');
    this.toastr.show('Log Out.');
    this.router.navigate(['/colaboradores/login']);
  }

  colaboradorNome() {
    return InfoColaborador.usuario;
  }
}
