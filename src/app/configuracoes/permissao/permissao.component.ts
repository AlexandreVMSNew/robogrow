import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PermissaoService } from '../../_services/Permissoes/permissao.service';
import { Permissao } from '../../_models/Permissoes/permissao';
import { TemplateModalService } from 'src/app/_services/Uteis/TemplateModal/templateModal.service';
import { EditarPermissaoComponent } from './editarPermissao/editarPermissao.component';
import { PermissaoObjetos } from 'src/app/_models/Permissoes/permissaoObjetos';

@Component({
  selector: 'app-permissao',
  templateUrl: './permissao.component.html'
})
export class PermissaoComponent implements OnInit, AfterViewInit {

  formularioComponent = 'PERMISSÕES';
  cadastrar = true;
  editar = true;
  listar = true;
  visualizar = true;
  excluir = false;

  permissaoFormularios: Permissao[];

  templateModalEditarPermissaoService = new TemplateModalService();
  editarPermissaoComponent = EditarPermissaoComponent;
  inputs: any;
  componentModal: any;
  tituloTemplateModal = '';

  constructor(private permissaoService: PermissaoService) { }

  ngOnInit() {
    this.carregarFormularios();
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
    }, error => {
      console.log(error.error);
    });
  }


  carregarFormularios() {
    this.permissaoService.getPermissaoFormularios().subscribe((_PERMISSOES: Permissao[]) => {
      this.permissaoFormularios = _PERMISSOES;
      console.log(this.permissaoFormularios);
    }, error => {
      console.log(error.error);
    });
  }

  abrirTemplateModalEditarPermissao(component, permissaoInput: Permissao) {
    this.componentModal = component;
    this.tituloTemplateModal = `Editar Permissões (${permissaoInput.formulario})`;
    this.inputs = Object.assign({permissao: permissaoInput});
    this.templateModalEditarPermissaoService.setTemplateModalStatus(true);
  }

  getTemplateModalEditarPermissao() {
    return this.templateModalEditarPermissaoService.getTemplateModalStatus();
  }

}
