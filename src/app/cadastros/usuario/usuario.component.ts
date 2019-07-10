import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Usuario } from '../../_models/Cadastros/Usuarios/Usuario';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../_services/Cadastros/Usuarios/usuario.service';
import { BsModalService, BsLocaleService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PermissaoService } from '../../_services/Permissoes/permissao.service';
import { Permissao } from '../../_models/Permissoes/permissao';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html'
})
export class UsuarioComponent implements OnInit, AfterViewInit {

  novo = false;
  editar = false;
  excluir = false;

  usuariosFiltrados: Usuario[];
  usuarios: Usuario[];
  usuario: Usuario;
  usuarioId: number;

  modoSalvar = '';
  cadastroForm: FormGroup;
  bodyExcluirUsuario = '';

  // tslint:disable-next-line:variable-name
  _filtroLista: string;
  filtroUsuarios: any;

  paginaAtual = 1;
  totalRegistros: number;

  constructor(
    private usuarioService: UsuarioService,
    private localeService: BsLocaleService,
    private toastr: ToastrService,
    private permissaoService: PermissaoService
    ) {
      this.localeService.use('pt-br');
    }

    ngOnInit() {
      this.getUsuarios();
    }

    ngAfterViewInit() {
      this.permissaoService.getPermissoesByFormularioAcaoObjeto('USUARIOS', 'NOVO').subscribe((_PERMISSAO: Permissao) => {
        this.novo = this.permissaoService.verificarPermissao(_PERMISSAO);
      });
      this.permissaoService.getPermissoesByFormularioAcaoObjeto('USUARIOS', 'EDITAR').subscribe((_PERMISSAO: Permissao) => {
        this.editar = this.permissaoService.verificarPermissao(_PERMISSAO);
      });
      this.permissaoService.getPermissoesByFormularioAcaoObjeto('USUARIOS', 'EXCLUIR').subscribe((_PERMISSAO: Permissao) => {
        this.excluir = this.permissaoService.verificarPermissao(_PERMISSAO);
      });
      this.usuarioId = this.permissaoService.getUsuarioId();
    }

  get filtroLista() {
    return this._filtroLista;
  }

  set filtroLista(value: string) {
    this._filtroLista = value;
    this.usuariosFiltrados = this.filtrarUsuarios(this.filtroLista);
  }

  excluirUsuario(usuario: Usuario, template: any) {
    template.show();
    this.usuario = usuario;
    this.bodyExcluirUsuario = `Tem certeza que deseja excluir o Usuario: ${usuario.userName}, Código: ${usuario.id}?`;
  }

  confirmeDelete(template: any) {
    this.usuarioService.deletarUsuario(this.usuario.id).subscribe(
    () => {
        template.hide();
        this.getUsuarios();
        this.toastr.success('Excluído com sucesso!');
      }, error => {
        this.toastr.error(`Erro ao tentar Excluir: ${error}`);
      });
  }

  filtrarUsuarios(filtrarPor: string): Usuario[] {
    this.filtroUsuarios = this.usuarios;

    if (filtrarPor) {
      filtrarPor = filtrarPor.toLocaleLowerCase();
      this.filtroUsuarios = this.usuarios.filter(
        usuario => usuario.userName.toLocaleLowerCase().indexOf(filtrarPor) !== -1
      );
    }

    this.totalRegistros = this.filtroUsuarios.length;
    return this.filtroUsuarios;
  }

  getUsuarios() {
      this.usuarioService.getAllUsuario().subscribe(
        // tslint:disable-next-line:variable-name
        (_usuarios: Usuario[]) => {
        this.usuarios = _usuarios;
        this.usuariosFiltrados = this.filtrarUsuarios(this.filtroLista);
      }, error => {
        this.toastr.error(`Erro ao tentar carregar usuarios: ${error}`);
      });
  }
}
