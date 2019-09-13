import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { UsuarioService } from 'src/app/_services/Cadastros/Usuarios/usuario.service';
import { ActivatedRoute } from '@angular/router';
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Usuario } from 'src/app/_models/Cadastros/Usuarios/Usuario';
import { UsuarioOcorrencia } from 'src/app/_models/Cadastros/Usuarios/UsuarioOcorrencia';
import { Nivel } from 'src/app/_models/Cadastros/Usuarios/Nivel';
import { UsuarioNivel } from 'src/app/_models/Cadastros/Usuarios/UsuarioNivel';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import * as moment from 'moment';
import { DatepickerOptions } from 'ng2-datepicker';
import * as ptLocale from 'date-fns/locale/pt';
import { DataService } from 'src/app/_services/Cadastros/Uteis/data.service';
import { Permissao } from 'src/app/_models/Permissoes/permissao';
@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editarUsuario.component.html'
})
export class EditarUsuarioComponent implements OnInit, AfterViewInit {

  editar = false;
  visualizarOcorrencia = false;
  visualizarNivel = false;

  cadastroForm: FormGroup;
  idUsuario: number;
  cadastroOcorrenciaForm: FormGroup;
  usuario: Usuario = new Usuario();
  usuarioOcorrencias: UsuarioOcorrencia[] = [];
  dataAtual = '';
  modoSalvarOcorrencia = '';

  niveis: Nivel[];
  niveisIdSelecionado: any;
  niveisUsuario: UsuarioNivel[];
  bsConfig: Partial<BsDatepickerConfig> = Object.assign({}, { containerClass: 'theme-dark-blue' });
  dateFormat = '';

  constructor(private usuarioService: UsuarioService,
              private router: ActivatedRoute,
              private fb: FormBuilder,
              private localeService: BsLocaleService,
              private toastr: ToastrService,
              private changeDetectionRef: ChangeDetectorRef,
              private permissaoService: PermissaoService,
              private dataService: DataService) {
    this.localeService.use('pt-br');
  }

  ngOnInit() {
    this.idUsuario = +this.router.snapshot.paramMap.get('id');
    this.getNiveis();
    this.validation();
    this.carregarUsuario();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewChecked() {
    this.changeDetectionRef.detectChanges();
  }

  ngAfterViewInit() {
    this.permissaoService.getPermissoesByFormulario(
      Object.assign({formulario: 'PRODUTOS'})).subscribe((_PERMISSOES: Permissao[]) => {
       this.editar = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'EDITAR')[0]);
       this.visualizarOcorrencia = this.permissaoService.verificarPermissao(_PERMISSOES
          .filter(c => c.acao === 'VISUALIZAR' && c.objeto === 'OCORRENCIA')[0]);
       this.visualizarNivel = this.permissaoService.verificarPermissao(_PERMISSOES
          .filter(c => c.acao === 'VISUALIZAR' && c.objeto === 'NIVEL')[0]);
    });
  }

  carregarUsuario() {

  this.usuarioOcorrencias.length = 0;
  this.usuarioService.getUsuarioById(this.idUsuario)
    .subscribe(
    (usuario: Usuario) => {
        this.usuario = Object.assign({}, usuario);
        const data = this.usuario.dataNascimento;
        this.usuario = Object.assign(this.usuario, { dataNascimento: this.dataService.getDataPTBR(data) });
        this.cadastroForm.patchValue(this.usuario);

        this.usuario.usuarioOcorrencias.forEach(ocorrencia => {
          ocorrencia = Object.assign(ocorrencia, { data: this.dataService.getDataPTBR(ocorrencia.data) });
          this.usuarioOcorrencias.push(ocorrencia);
        });

        this.niveisIdSelecionado = [];
        this.niveisUsuario = [];

        this.usuario.usuarioNivel.forEach(niveis => {
          this.niveisUsuario.push(niveis);
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
      usuarioOcorrencias: this.fb.array([]),
      usuarioNivel: [this.fb.group({
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

  adicionarUsuarioNivel(niveisSelecionados: any) {
    this.niveisUsuario = [];
    niveisSelecionados.forEach(niveis => {
      this.niveisUsuario.push(Object.assign({ userId: this.idUsuario, roleId: niveis}));
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
    this.usuarioOcorrencias.push(Object.assign(this.cadastroOcorrenciaForm.value, {id: 0}));
    template.hide();
  }

  removerOcorrencia(ocorrencia: any) {
    this.usuarioOcorrencias.splice(this.usuarioOcorrencias.indexOf(ocorrencia), 1);
  }

  salvarAlteracao() {
    const data = this.cadastroForm.get('dataNascimento').value.toLocaleString();

    this.usuario = Object.assign(this.cadastroForm.value, {id: this.usuario.id,
      dataNascimento: this.dataService.getDataSQL(data)});
    this.usuario.usuarioOcorrencias = [];
    this.usuarioOcorrencias.forEach(ocorrencia => {
      const dataOcorrencia = ocorrencia.data.toLocaleString();
      ocorrencia = Object.assign(ocorrencia, { usuarioId: this.usuario.id, data: this.dataService.getDataSQL(dataOcorrencia)});
      this.usuario.usuarioOcorrencias.push(ocorrencia);
    });

    this.usuario.usuarioNivel = [];
    this.niveisUsuario.forEach(niveis => {
      this.usuario.usuarioNivel.push(niveis);
    });

    this.usuarioService.editarUsuario(this.usuario).subscribe(
      () => {
        this.toastr.success('Editado com sucesso!');
        this.carregarUsuario();
      }, error => {
        this.toastr.error(`Erro ao tentar Editar: ${error.error}`);
        console.log(error);
      });
  }

}
