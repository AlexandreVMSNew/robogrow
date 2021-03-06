import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/_models/Cadastros/Usuarios/Usuario';
import { UsuarioService } from 'src/app/_services/Cadastros/Usuarios/usuario.service';
import { Nivel } from 'src/app/_models/Cadastros/Usuarios/Nivel';
import { UsuarioNivel } from 'src/app/_models/Cadastros/Usuarios/UsuarioNivel';
import { PermissaoObjetos } from 'src/app/_models/Permissoes/permissaoObjetos';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';

@Component({
  selector: 'app-cadastrar-usuario',
  templateUrl: './cadastrarUsuario.component.html'
})
export class CadastrarUsuarioComponent implements OnInit, AfterViewInit {

  formularioComponent = 'USUÁRIOS';
  cadastrar = true;
  editar = true;
  listar = true;
  visualizar = true;
  excluir = true;

  titulo = 'Cadastrar';
  cadastroForm: FormGroup;
  usuario: Usuario;

  niveis: Nivel[];
  niveisIdSelecionado: any;
  niveisUsuario: UsuarioNivel[];

  constructor(public fb: FormBuilder,
              private toastr: ToastrService,
              private permissaoService: PermissaoService,
              private usuarioService: UsuarioService,
              public router: Router) { }

  ngOnInit() {
    this.getNiveis();
    this.validation();
  }

  ngAfterViewInit() {
  /*  this.permissaoService.getPermissaoObjetosByFormularioAndNivelId(Object.assign({ formulario: this.formularioComponent }))
    .subscribe((permissaoObjetos: PermissaoObjetos[]) => {
      const permissaoFormulario = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'FORMULÁRIO');
      this.cadastrar = (permissaoFormulario !== null ) ? permissaoFormulario.cadastrar : true;
      this.editar = (permissaoFormulario !== null ) ? permissaoFormulario.editar : true;
      this.listar = (permissaoFormulario !== null ) ? permissaoFormulario.listar : true;
      this.visualizar = (permissaoFormulario !== null ) ? permissaoFormulario.visualizar : true;
      this.excluir = (permissaoFormulario !== null ) ? permissaoFormulario.excluir : true;
    }, error => {
      console.log(error.error);
    });*/
  }

  validation() {
    this.cadastroForm = this.fb.group({
      nomeCompleto: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', Validators.required],
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
    this.usuarioService.getNiveis().subscribe(
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
      this.usuarioService.cadastrarUsuario(this.usuario).subscribe(
        () => {
          this.usuarioService.getIdUltimoUsuario().subscribe(
            (_USUARIO: Usuario) => {
              const IdUltimoUsuario = _USUARIO.id;
              this.usuario = Object.assign(this.cadastroForm.value, {id: IdUltimoUsuario});

              this.usuario.niveis = [];
              this.niveisUsuario.forEach(niveis => {
                this.usuario.niveis.push(Object.assign({ userId: IdUltimoUsuario , roleId: niveis.roleId}));
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
