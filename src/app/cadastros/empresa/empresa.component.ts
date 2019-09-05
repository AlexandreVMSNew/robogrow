import { Component, OnInit } from '@angular/core';
import { Empresa } from 'src/app/_models/Cadastros/Empresas/Empresa';
import { FormGroup } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { Permissao } from 'src/app/_models/Permissoes/permissao';
import { EmpresaService } from 'src/app/_services/Cadastros/Empresas/empresa.service';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html'
})
export class EmpresaComponent implements OnInit {

  novo = false;
  editar = false;
  visualizar = false;

  empresa: Empresa;
  empresas: Empresa[];

  modoSalvar = '';
  cadastroForm: FormGroup;

  paginaAtual = 1;
  totalRegistros = 0;

  valueCnpjCpfPipe = '';

  idEmpresa: number;

  constructor(
    private empresaService: EmpresaService,
    private localeService: BsLocaleService,
    private toastr: ToastrService,
    public permissaoService: PermissaoService
    ) {
      this.localeService.use('pt-br');
    }

  ngOnInit() {
    this.getEmpresas();
  }

  ngAfterViewInit() {
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('EMPRESAS', 'NOVO').subscribe((_PERMISSAO: Permissao) => {
      this.novo = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('EMPRESAS', 'EDITAR').subscribe((_PERMISSAO: Permissao) => {
      this.editar = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('EMPRESAS', 'VISUALIZAR').subscribe((_PERMISSAO: Permissao) => {
      this.visualizar = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
  }

  getTemplateEmpresa() {
    return this.empresaService.getEmpresaTemplateStatus();
  }

  abrirTemplateEmpresa(idEmpresa: number) {
    this.idEmpresa = idEmpresa;
    this.empresaService.setEmpresaTemplateStatus(true);
  }


  getEmpresas() {
    this.empresaService.getAllEmpresa().subscribe(
      (_EMPRESAS: Empresa[]) => {
      this.empresas = _EMPRESAS;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar empresas: ${error.error}`);
    });
  }

}
