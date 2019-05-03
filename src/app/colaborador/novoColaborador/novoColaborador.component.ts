import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Colaborador } from 'src/app/_models/Colaborador';
import { ColaboradorService } from 'src/app/_services/colaborador.service';

@Component({
  selector: 'app-novo-colaborador',
  templateUrl: './novoColaborador.component.html',
  styleUrls: ['./novoColaborador.component.css']
})
export class NovoColaboradorComponent implements OnInit {

  titulo = 'Cadastrar';
  cadastroForm: FormGroup;
  colaborador: Colaborador;

  constructor(public fb: FormBuilder,
              private toastr: ToastrService,
              private colaboradorService: ColaboradorService,
              public router: Router) { }

  ngOnInit() {
    this.validation();
  }

  validation() {
    this.cadastroForm = this.fb.group({
      nomeCompleto: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', Validators.required],
      passwords: this.fb.group({
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', Validators.required]
      }, { validator : this.compararSenhas})
    });
  }

  compararSenhas(fb: FormGroup) {
    const confirmSenhaCtrl = fb.get('confirmPassword');
    if (confirmSenhaCtrl.errors == null || 'mismatch' in confirmSenhaCtrl.errors) {
      if (fb.get('password').value !== confirmSenhaCtrl.value) {
        confirmSenhaCtrl.setErrors({mismatch: true});
      } else {
        confirmSenhaCtrl.setErrors(null);
      }
    }
  }

  cadastrarColaborador() {
    if (this.cadastroForm.valid) {
      this.colaborador = Object.assign({password: this.cadastroForm.get('passwords.password').value}, this.cadastroForm.value);
      this.colaboradorService.novoColaborador(this.colaborador).subscribe(
        () => {
          this.router.navigate(['/colaboradores/login']);
          this.toastr.success('Cadastro Realizado!');
        }, error => {
          const erro = error.error;
          console.log(erro);
          erro.forEach(element => {
            switch (element.code) {
            case 'DuplicateUserName':
              this.toastr.error('Colaborador já existente.');
              break;
            default:
              this.toastr.error(`Erro no Cadastro! CODE: ${element.code}`);
              break;
            }
          });
        }
      );
    }
  }
}
