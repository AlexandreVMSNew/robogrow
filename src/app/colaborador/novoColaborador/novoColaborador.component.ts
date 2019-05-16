import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Colaborador } from 'src/app/_models/Cadastros/Colaboradores/Colaborador';
import { ColaboradorService } from 'src/app/_services/Cadastros/Colaboradores/colaborador.service';
import { Nivel } from 'src/app/_models/Cadastros/Colaboradores/Nivel';
import { ColaboradorNivel } from 'src/app/_models/Cadastros/Colaboradores/ColaboradorNivel';

@Component({
  selector: 'app-novo-colaborador',
  templateUrl: './novoColaborador.component.html',
  styleUrls: ['./novoColaborador.component.css']
})
export class NovoColaboradorComponent implements OnInit {

  titulo = 'Cadastrar';
  cadastroForm: FormGroup;
  colaborador: Colaborador;

  niveis: Nivel[];
  niveisIdSelecionado: any;
  niveisColaborador: ColaboradorNivel[];

  constructor(public fb: FormBuilder,
              private toastr: ToastrService,
              private colaboradorService: ColaboradorService,
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
      colaboradorNivel: [this.fb.group({
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

  adicionarColaboradorNivel(niveisSelecionados: any) {
    this.niveisColaborador = [];
    niveisSelecionados.forEach(niveis => {
      this.niveisColaborador.push(Object.assign({ userId: 0, roleId: niveis}));
    });
  }

  getNiveis() {
    this.niveis = [];
    this.colaboradorService.getAllNiveis().subscribe(
      (_NIVEIS: Nivel[]) => {
      this.niveis = _NIVEIS;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar niveis: ${error.error}`);
    });
  }

  cadastrarColaborador() {
    if (this.cadastroForm.valid) {
      this.colaborador = Object.assign(this.cadastroForm.value,
         {password: this.cadastroForm.get('passwords.password').value, colaboradorNivel: null});
      this.colaboradorService.novoColaborador(this.colaborador).subscribe(
        () => {
          this.colaboradorService.getIdUltimoColaborador().subscribe(
            (_COLABORADOR: Colaborador) => {
              const IdUltimoColaborador = _COLABORADOR.id;
              this.colaborador = Object.assign(this.cadastroForm.value, {id: IdUltimoColaborador});

              this.colaborador.colaboradorNivel = [];
              this.niveisColaborador.forEach(niveis => {
                this.colaborador.colaboradorNivel.push(Object.assign({ userId: IdUltimoColaborador , roleId: niveis.roleId}));
              });

              this.colaboradorService.editarColaborador(this.colaborador).subscribe(
                () => {
                  this.toastr.success('Cadastrado com sucesso!');
                  this.router.navigate([`/colaboradores/editar/${IdUltimoColaborador}`]);
              });
          });
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
