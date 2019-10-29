import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PermissaoObjetos } from 'src/app/_models/Permissoes/permissaoObjetos';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { TemplateModalService } from 'src/app/_services/Uteis/TemplateModal/templateModal.service';

@Component({
  selector: 'app-template-permissao-objeto',
  templateUrl: './templatePermissaoObjeto.component.html'
})
export class TemplatePermissaoObjetoComponent implements OnInit, AfterViewInit {

  @Input() objeto: PermissaoObjetos;
  @Input() permissoesId: number;
  @Input() templateModalService: TemplateModalService;

  formularioComponent = 'PERMISSÕES';
  cadastrarObjetoVar = false;
  editarObjeto = false;

  cadastroObjetoForm: FormGroup;

  constructor(private fb: FormBuilder,
              private permissaoService: PermissaoService,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.validarObjetoForm();
    if (this.objeto !== null) {
      this.carregarObjeto();
    }
  }

  ngAfterViewInit() {
    this.permissaoService.getPermissaoObjetosByFormularioAndNivelId(Object.assign({ formulario: this.formularioComponent }))
    .subscribe((permissaoObjetos: PermissaoObjetos[]) => {
      const permissaoObjeto = this.permissaoService.verificarPermissaoPorObjetos(permissaoObjetos, 'OBJETOS');
      this.cadastrarObjetoVar = (permissaoObjeto !== null ) ? permissaoObjeto.cadastrar : false;
      this.editarObjeto = (permissaoObjeto !== null ) ? permissaoObjeto.editar : false;
    }, error => {
      console.log(error.error);
    });
  }

  carregarObjeto() {
    this.cadastroObjetoForm.patchValue(this.objeto);
  }

  validarObjetoForm() {
    this.cadastroObjetoForm = this.fb.group({
        id: [''],
        permissoesId: [''],
        objeto: ['', Validators.required]
    });
  }

  cadastrarObjeto() {
    this.objeto = Object.assign(this.cadastroObjetoForm.value, {
      id: 0,
      permissoesId: this.permissoesId
    });
    console.log(this.objeto);
    this.permissaoService.cadastrarPermissaoObjeto(this.objeto).subscribe(() => {
      this.toastr.success('Cadastrado com sucesso!');
      this.permissaoService.atualizarObjetos();
      this.fecharTemplate();
    }, error => {
      console.log(error.error);
    });
  }

  salvarAlteracoes() {
    this.objeto = Object.assign(this.cadastroObjetoForm.value);

    this.permissaoService.editarPermissaoObjeto(this.objeto).subscribe(() => {
      this.toastr.success('Salvo com sucesso!');
      this.permissaoService.atualizarObjetos();
      this.fecharTemplate();
    }, error => {
      console.log(error.error);
    });
  }

  fecharTemplate() {
    this.templateModalService.setTemplateModalStatus(false);
  }

}
