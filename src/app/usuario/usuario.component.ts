import { Component, OnInit } from '@angular/core';
import { Usuario } from '../_models/Cadastros/Usuarios/Usuario';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../_services/Cadastros/Usuarios/usuario.service';
import { BsModalService, BsLocaleService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html'
})

export class UsuarioComponent implements OnInit {

  usuariosFiltrados: Usuario[];
  usuarios: Usuario[];
  usuario: Usuario;
  modoSalvar = '';
  cadastroForm: FormGroup;
  bodyDeletarUsuario = '';

  // tslint:disable-next-line:variable-name
  _filtroLista: string;

  constructor(
    private usuarioService: UsuarioService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private toastr: ToastrService
    ) {
      this.localeService.use('pt-br');
    }

  get filtroLista() {
    return this._filtroLista;
  }

  set filtroLista(value: string) {
    this._filtroLista = value;
    this.usuariosFiltrados = this.filtroLista ? this.filtrarUsuarios(this.filtroLista) : this.usuarios;
  }

  excluirUsuario(usuario: Usuario, template: any) {
    this.usuario = usuario;
    this.bodyDeletarUsuario = `Tem certeza que deseja excluir o Usuario: ${usuario.userName}, Código: ${usuario.id}`;
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

  ngOnInit() {
    this.getUsuarios();
  }

  filtrarUsuarios(filtrarPor: string): Usuario[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.usuarios.filter(
      usuario => usuario.userName.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  getUsuarios() {
      this.usuarioService.getAllUsuario().subscribe(
        // tslint:disable-next-line:variable-name
        (_usuarios: Usuario[]) => {
        this.usuarios = _usuarios;
        this.usuariosFiltrados = this.usuarios;
      }, error => {
        this.toastr.error(`Erro ao tentar carregar usuarios: ${error}`);
      });
  }
}
