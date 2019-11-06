import { Component, OnInit, ChangeDetectorRef, AfterViewInit, AfterViewChecked } from '@angular/core';
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
import { DataService } from 'src/app/_services/Cadastros/Uteis/data.service';
import { Permissao } from 'src/app/_models/Permissoes/permissao';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';
import { PermissaoObjetos } from 'src/app/_models/Permissoes/permissaoObjetos';
@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editarUsuario.component.html'
})
export class EditarUsuarioComponent implements OnInit, AfterViewInit, AfterViewChecked {

  formularioComponent = 'USUÁRIOS';
  cadastrar = false;
  editar = false;
  listar = false;
  visualizar = false;
  excluir = false;
  visualizarOcorrencia = false;
  editarCampoNivel = false;
  visualizarCampoNivel = false;

  cadastroForm: FormGroup;
  idUsuario: number;
  idUsuarioLogado: number;

  cadastroOcorrenciaForm: FormGroup;
  usuario: Usuario = new Usuario();
  usuarioOcorrencias: UsuarioOcorrencia[] = [];
  dataAtual = '';
  modoSalvarOcorrencia = '';

  niveis: Nivel[];
  niveisIdSelecionado: any;
  niveisUsuario: UsuarioNivel[] = [];
  
  dateFormat = '';

  arquivoFotoPerfil: File;
  baseURLFotoPerfil = '';
  nomeArquivoFotoPerfil = '';

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
    this.idUsuarioLogado = this.permissaoService.getUsuarioId();
    this.idUsuario = +this.router.snapshot.paramMap.get('id');
    this.getNiveis();
    this.validarForm();
    this.validarOcorrenciaForm();
  }

  ngAfterViewChecked() {
    this.changeDetectionRef.detectChanges();
  }

  ngAfterViewInit() {
    this.permissaoService.getPermissaoObjetosByFormularioAndNivelId(Object.assign({ formulario: this.formularioComponent }))
    .subscribe((permissaoObjetos: PermissaoObjetos[]) => {
      const permissaoFormulario = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'FORMULÁRIO');
      this.cadastrar = (permissaoFormulario !== null ) ? permissaoFormulario.cadastrar : false;
      this.editar = (permissaoFormulario !== null ) ? permissaoFormulario.editar : false;
      this.listar = (permissaoFormulario !== null ) ? permissaoFormulario.listar : false;
      this.visualizar = (permissaoFormulario !== null ) ? permissaoFormulario.visualizar : false;
      this.excluir = (permissaoFormulario !== null ) ? permissaoFormulario.excluir : false;

      const permissaoCampoNivel = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'CAMPO NÍVEL');
      this.editarCampoNivel = (permissaoCampoNivel !== null ) ? permissaoCampoNivel.editar : false;
      this.visualizarCampoNivel = (permissaoCampoNivel !== null ) ? permissaoCampoNivel.visualizar : false;
      this.carregarUsuario();
    }, error => {
      console.log(error.error);
    });
  }

  configurarAlteracoes() {
    (this.editarCampoNivel === true) ?
      this.cadastroForm.controls.usuarioNivel.enable() : this.cadastroForm.controls.usuarioNivel.disable();
  }

  carregarUsuario() {
    this.usuarioOcorrencias.length = 0;
    this.usuarioService.getUsuarioById(this.idUsuario)
    .subscribe((usuario: Usuario) => {
      this.usuario = Object.assign({}, usuario);
      const data = this.usuario.dataNascimento;
      this.usuario = Object.assign(this.usuario, { dataNascimento: this.dataService.getDataPTBR(data) });
      this.cadastroForm.patchValue(this.usuario);

      this.usuario.usuarioOcorrencias.forEach(ocorrencia => {
        ocorrencia = Object.assign(ocorrencia, { data: this.dataService.getDataPTBR(ocorrencia.data) });
        this.usuarioOcorrencias.push(ocorrencia);
      });

      const nomeArquivo = (this.usuario.nomeArquivoFotoPerfil === null) ? '' : this.usuario.nomeArquivoFotoPerfil;
      this.baseURLFotoPerfil = this.permissaoService.getUrlUsuarioLogadoFotoPerfil(this.usuario.id, nomeArquivo);

      this.niveisIdSelecionado = this.usuario.usuarioNivel[0].roleId;
      this.niveisUsuario.push(Object.assign({ userId: this.idUsuario, roleId: this.niveisIdSelecionado}));
      this.cadastroForm.controls.usuarioNivel.setValue(this.niveisIdSelecionado);

      this.configurarAlteracoes();
    });
  }

  validarForm()  {
    this.cadastroForm = this.fb.group({
      id: [],
      nomeCompleto: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      nomeArquivoFotoPerfil: [''],
      usuarioOcorrencias: this.fb.array([]),
      usuarioNivel: ['', Validators.required]
    });
  }

  validarOcorrenciaForm() {
    this.cadastroOcorrenciaForm = this.fb.group({
      id: [],
      data: ['', Validators.required],
      descricao: ['', Validators.required],
      observacao: ['', Validators.required]
    });
  }

  adicionarUsuarioNivel(niveisSelecionados: any) {
    this.niveisUsuario = [];
    this.niveisUsuario.push(Object.assign({ userId: this.idUsuario, roleId: niveisSelecionados}));
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

  alterarNomeArquivoFotoPerfil(event) {
    if (event.target.files && event.target.files.length) {
      this.arquivoFotoPerfil = event.target.files[0];
      this.nomeArquivoFotoPerfil = event.target.value.split('\\', 3)[2];
      const reader = new FileReader();
      reader.onload = e => this.baseURLFotoPerfil = reader.result.toString();
      reader.readAsDataURL(this.arquivoFotoPerfil);
    }
  }

  editarUsuario() {
    this.usuarioService.editarUsuario(this.usuario).subscribe(() => {
      this.toastr.success('Editado com sucesso!');
      this.carregarUsuario();
    }, error => {
      this.toastr.error(`Erro ao tentar Editar: ${error.error}`);
      console.log(error);
    });
  }

  salvarAlteracao() {
    const data = this.cadastroForm.get('dataNascimento').value.toLocaleString();

    this.usuario = Object.assign(this.cadastroForm.value, {
      id: this.usuario.id,
      dataNascimento: this.dataService.getDataSQL(data),
      nomeArquivoFotoPerfil: this.nomeArquivoFotoPerfil,
      usuarioNivel:  this.niveisUsuario
    });

    this.usuario.usuarioOcorrencias = [];
    this.usuarioOcorrencias.forEach(ocorrencia => {
      const dataOcorrencia = ocorrencia.data.toLocaleString();
      ocorrencia = Object.assign(ocorrencia, { usuarioId: this.usuario.id, data: this.dataService.getDataSQL(dataOcorrencia)});
      this.usuario.usuarioOcorrencias.push(ocorrencia);
    });

    if (this.arquivoFotoPerfil) {
      this.usuarioService.enviarFotoPerfil(this.usuario.id, this.arquivoFotoPerfil, this.usuario.nomeArquivoFotoPerfil)
      .subscribe((result: any) => {
        if (result.retorno.toString() === 'EXTENSAO INVALIDA') {
          this.toastr.error(`Foto de perfil não atualizada. Apenas Imagens com extensão (.png | .jpg | .bmp) podem ser usadas!`);
        } else if (result.retorno.toString() === 'OK') {
          this.arquivoFotoPerfil = null;
          this.editarUsuario();
        }
      });
    } else {
      this.editarUsuario();
    }
  }

}
