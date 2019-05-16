import { Component, OnInit } from '@angular/core';
import { ColaboradorService } from 'src/app/_services/Cadastros/Colaboradores/colaborador.service';
import { ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Colaborador } from 'src/app/_models/Cadastros/Colaboradores/Colaborador';
import { ColaboradorOcorrencia } from 'src/app/_models/Cadastros/Colaboradores/ColaboradorOcorrencia';
import { Nivel } from 'src/app/_models/Cadastros/Colaboradores/Nivel';
import { ColaboradorNivel } from 'src/app/_models/Cadastros/Colaboradores/ColaboradorNivel';

@Component({
  selector: 'app-editar-colaborador',
  templateUrl: './editarColaborador.component.html',
  styleUrls: ['./editarColaborador.component.css']
})
export class EditarColaboradorComponent implements OnInit {

  cadastroForm: FormGroup;
  idColaborador: number;
  cadastroOcorrenciaForm: FormGroup;
  colaborador: Colaborador = new Colaborador();
  colaboradorOcorrencias: ColaboradorOcorrencia[] = [];
  dataAtual = '';
  modoSalvarOcorrencia = '';

  niveis: Nivel[];
  niveisIdSelecionado: any;
  niveisColaborador: ColaboradorNivel[];

  constructor(private colaboradorService: ColaboradorService,
              private router: ActivatedRoute,
              private fb: FormBuilder,
              private localeService: BsLocaleService,
              private toastr: ToastrService) {
    this.localeService.use('pt-br');
  }

  ngOnInit() {
    this.idColaborador = +this.router.snapshot.paramMap.get('id');
    this.getNiveis();
    this.validation();
    this.carregarColaborador();
  }

  carregarColaborador() {

  this.colaboradorOcorrencias.length = 0;
  this.colaboradorService.getColaboradorById(this.idColaborador)
    .subscribe(
    (colaborador: Colaborador) => {
        this.colaborador = Object.assign({}, colaborador);

        this.cadastroForm.patchValue(this.colaborador);

        this.colaborador.colaboradorOcorrencias.forEach(ocorrencia => {
          this.colaboradorOcorrencias.push(ocorrencia);
        });

        this.niveisIdSelecionado = [];
        this.niveisColaborador = [];

        this.colaborador.colaboradorNivel.forEach(niveis => {
          this.niveisColaborador.push(niveis);
          this.niveisIdSelecionado.push(niveis.roleId);
        });
    });
  }

  validation()  {
    this.cadastroForm = this.fb.group({
      id: [],
      nomeCompleto: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      passwords: this.fb.group({
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', Validators.required]
      }, { validator : this.compararSenhas}),
      colaboradorOcorrencias: this.fb.array([]),
      colaboradorNivel: [this.fb.group({
        userId: [''],
        roleId: ['']
      }), Validators.required]
    });

    this.cadastroOcorrenciaForm = this.fb.group({
      id: [],
      data: ['', Validators.required],
      descricao: ['', Validators.required],
      observacao: ['', Validators.required]
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
      this.niveisColaborador.push(Object.assign({ userId: this.idColaborador, roleId: niveis}));
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

  openModal(template: any) {
    this.cadastroOcorrenciaForm.reset();
    template.show(template);
  }

  novaOcorrencia(template: any)  {
    this.modoSalvarOcorrencia = 'post';
    this.openModal(template);
  }

  criaOcorrencia(ocorrencia: any): FormGroup {
    return this.fb.group({
      id: [ocorrencia.id],
      data: [ocorrencia.data, Validators.required],
      descricao: [ocorrencia.descricao, [Validators.required]],
      observacao: [ocorrencia.observacao, Validators.required],
    });
  }

  adicionarOcorrencia(template: any) {
    this.colaboradorOcorrencias.push(Object.assign(this.cadastroOcorrenciaForm.value, {id: 0}));
    template.hide();
  }

  removerOcorrencia(ocorrencia: any) {
    this.colaboradorOcorrencias.splice(this.colaboradorOcorrencias.indexOf(ocorrencia), 1);
  }

  salvarAlteracao() {
    this.colaborador = Object.assign({id: this.colaborador.id}, this.cadastroForm.value);
    this.colaborador.colaboradorOcorrencias = [];
    this.colaboradorOcorrencias.forEach(ocorrencia => {
      this.colaborador.colaboradorOcorrencias.push(ocorrencia);
    });

    this.colaborador.colaboradorNivel = [];
    this.niveisColaborador.forEach(niveis => {
      this.colaborador.colaboradorNivel.push(niveis);
    });


    this.colaboradorService.editarColaborador(this.colaborador).subscribe(
      () => {
        this.toastr.success('Editado com sucesso!');
        this.carregarColaborador();
      }, error => {
        this.toastr.error(`Erro ao tentar Editar: ${error.error}`);
        console.log(error);
      });
  }

}
