import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/_models/Cadastros/Usuarios/Usuario';
import { UsuarioService } from 'src/app/_services/Cadastros/Usuarios/usuario.service';
import { Nivel } from 'src/app/_models/Cadastros/Usuarios/Nivel';
import { UsuarioNivel } from 'src/app/_models/Cadastros/Usuarios/UsuarioNivel';

@Component({
  selector: 'app-novo-usuario',
  templateUrl: './novoUsuario.component.html'
})
export class NovoUsuarioComponent implements OnInit {

  titulo = 'Cadastrar';
  cadastroForm: FormGroup;
  usuario: Usuario;

  niveis: Nivel[];
  niveisIdSelecionado: any;
  niveisUsuario: UsuarioNivel[];

  constructor(public fb: FormBuilder,
              private toastr: ToastrService,
              private usuarioService: UsuarioService,
              public router: Router) { }

  ngOnInit() {
    this.getNiveis();
    this.validation();
  }

  validation() {
    this.cadastroForm = this.fb.group({
      nomeCompleto: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      passwords: this.fb.group({
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', Validators.required]
      }, { validator : this.compararSenhas}),
      usuarioNivel: [this.fb.group({
        userId: [''],
        roleId: ['']
      }), Validators.required],
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

  adicionarUsuarioNivel(niveisSelecionados: any) {
    this.niveisUsuario = [];
    niveisSelecionados.forEach(niveis => {
      this.niveisUsuario.push(Object.assign({ userId: 0, roleId: niveis}));
    });
  }

  getNiveis() {
    this.niveis = [];
    this.usuarioService.getAllNiveis().subscribe(
      (_NIVEIS: Nivel[]) => {
      this.niveis = _NIVEIS;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar niveis: ${error.error}`);
    });
  }

  cadastrarUsuario() {
    if (this.cadastroForm.valid) {
      this.usuario = Object.assign(this.cadastroForm.value,
         {password: this.cadastroForm.get('passwords.password').value, usuarioNivel: null});
      this.usuarioService.novoUsuario(this.usuario).subscribe(
        () => {
          this.usuarioService.getIdUltimoUsuario().subscribe(
            (_USUARIO: Usuario) => {
              const IdUltimoUsuario = _USUARIO.id;
              this.usuario = Object.assign(this.cadastroForm.value, {id: IdUltimoUsuario});

              this.usuario.usuarioNivel = [];
              this.niveisUsuario.forEach(niveis => {
                this.usuario.usuarioNivel.push(Object.assign({ userId: IdUltimoUsuario , roleId: niveis.roleId}));
              });

              this.usuarioService.editarUsuario(this.usuario).subscribe(
                () => {
                  this.toastr.success('Cadastrado com sucesso!');
                  this.router.navigate([`/usuarios/editar/${IdUltimoUsuario}`]);
              });
          });
        }, error => {
          const erro = error.error;
          console.log(erro);
          erro.forEach(element => {
            switch (element.code) {
            case 'DuplicateUserName':
              this.toastr.error('Usuario já existente.');
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
