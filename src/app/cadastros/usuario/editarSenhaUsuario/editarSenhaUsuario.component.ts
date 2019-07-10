import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/_services/Cadastros/Usuarios/usuario.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UsuarioSenha } from 'src/app/_models/Cadastros/Usuarios/UsuarioSenha';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';

@Component({
  selector: 'app-editar-senha-usuario',
  templateUrl: './editarSenhaUsuario.component.html'
})
export class EditarSenhaUsuarioComponent implements OnInit {

  cadastroForm: FormGroup;
  senhas: UsuarioSenha;
  idUsuario: any;
  constructor(private usuarioService: UsuarioService,
              private router: ActivatedRoute,
              private router2: Router,
              private fb: FormBuilder,
              private localeService: BsLocaleService,
              private toastr: ToastrService,
              public permissaoService: PermissaoService) {
    this.localeService.use('pt-br');
  }

  ngOnInit() {
    this.idUsuario = +this.router.snapshot.paramMap.get('id');
    this.validation();
  }

  validation()  {
    this.cadastroForm = this.fb.group({
      senhaAtual: ['', [Validators.required, Validators.minLength(4)]],
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

  salvarAlteracao() {
    this.senhas = Object.assign({ novaSenha: this.cadastroForm.get('passwords.password').value,
     senhaAtual: this.cadastroForm.get('senhaAtual').value });

    this.usuarioService.editarSenhaUsuario(this.permissaoService.getUsuarioId(), this.senhas).subscribe(
      () => {
        this.toastr.success('Senha alterada com sucesso!');
        this.router2.navigate([`/usuarios/editar/${this.permissaoService.getUsuarioId()}`]);
      }, error => {
        this.toastr.error(`Erro ao tentar Editar Senha: ${error.error}`);
        console.log(error);
      });
  }

}
