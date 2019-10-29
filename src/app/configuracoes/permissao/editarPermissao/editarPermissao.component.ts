import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Nivel } from 'src/app/_models/Cadastros/Usuarios/Nivel';
import { UsuarioService } from 'src/app/_services/Cadastros/Usuarios/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { Permissao } from 'src/app/_models/Permissoes/permissao';
import { PermissaoObjetos } from 'src/app/_models/Permissoes/permissaoObjetos';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { TemplateModalService } from 'src/app/_services/Uteis/TemplateModal/templateModal.service';
import { TemplatePermissaoObjetoComponent } from './templatePermissaoObjeto/templatePermissaoObjeto.component';

@Component({
  selector: 'app-editar-permissao',
  templateUrl: './editarPermissao.component.html'
})

export class EditarPermissaoComponent implements OnInit, AfterViewInit {

  @Input() permissao: Permissao;

  formularioComponent = 'PERMISSÕES';
  cadastrar = false;
  editar = false;
  listar = false;
  visualizar = false;
  excluir = false;
  editarObjeto = false;
  cadastrarObjeto = false;

  niveis: Nivel[];
  nivelIdSelecionado: number;

  permissaoObjetos: PermissaoObjetos[];

  templateModalObjetoService = new TemplateModalService();
  templateObjetoComponent = TemplatePermissaoObjetoComponent;
  inputs: any;
  componentModal: any;

  constructor(private usuarioService: UsuarioService,
              private permissaoService: PermissaoService,
              private toastr: ToastrService) {
                this.permissaoService.atualizaObjetos.subscribe(x => {
                  this.carregarObjetos();
                });
              }

  ngOnInit() {
    this.getNiveis();
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

      const permissaoObjeto = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'OBJETOS');
      this.cadastrarObjeto = (permissaoObjeto !== null ) ? permissaoObjeto.cadastrar : false;
      this.editarObjeto = (permissaoObjeto !== null ) ? permissaoObjeto.editar : false;
    }, error => {
      console.log(error.error);
    });
  }

  carregarObjetos() {
    this.permissaoObjetos = [];
    if (this.nivelIdSelecionado) {
      this.permissaoService.getPermissaoObjetosByFormularioAndNivelId(
        Object.assign({formulario: this.permissao.formulario}), this.nivelIdSelecionado)
      .subscribe((_OBJETOS: PermissaoObjetos[]) => {
        _OBJETOS.forEach((objeto: PermissaoObjetos) => {
          if (objeto.permissaoAcoes.length === 0) {
            objeto.permissaoAcoes.push(Object.assign({
              id: 0,
              nivelId: this.nivelIdSelecionado,
              permissaoObjetosId: objeto.id,
              cadastrar: false,
              editar: false,
              listar: false,
              visualizar: false,
              excluir: false
            }));
          }
        });
        this.permissaoObjetos = _OBJETOS;
      });
    }
  }

  salvarAlteracoes() {
    this.permissaoService.editarPermissaoObjetos(this.permissaoObjetos).subscribe(() => {
      this.toastr.success('Salvo com sucesso!');
      this.permissaoService.atualizarObjetos();
    }, error => {
      console.log(error.error);
    });
  }

  alterarPermissao(id, objetoCheck) {
    const objeto = this.permissaoObjetos.filter(c => c.id === id)[0].permissaoAcoes[0];
    this.permissaoObjetos.filter(c => c.id === id)[0].permissaoAcoes[0] = Object.assign(objeto, objetoCheck);
  }

  abrirTemplateModalObjeto(component, objetoInput: PermissaoObjetos) {
    this.componentModal = component;
    this.inputs = Object.assign({
      objeto: objetoInput,
      permissoesId: this.permissao.id,
      templateModalService: this.templateModalObjetoService
    });
    this.templateModalObjetoService.setTemplateModalStatus(true);
  }

  getTemplateModalObjeto() {
    return this.templateModalObjetoService.getTemplateModalStatus();
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

}
