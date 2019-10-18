import { Component, OnInit, ViewChild, Input, ChangeDetectorRef,  AfterViewInit, AfterViewChecked } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Empresa } from 'src/app/_models/Cadastros/Empresas/Empresa';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/_services/Cadastros/Uteis/data.service';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { EmpresaService } from 'src/app/_services/Cadastros/Empresas/empresa.service';
import { Permissao } from 'src/app/_models/Permissoes/permissao';
import { CidadeService } from 'src/app/_services/Cadastros/Uteis/cidade.service';
import { EstadoService } from 'src/app/_services/Cadastros/Uteis/estado.service';
import { Cidade } from 'src/app/_models/Cadastros/Uteis/Cidade';
import { Estado } from 'src/app/_models/Cadastros/Uteis/Estado';
import { InfoAPI } from 'src/app/_models/Info/infoAPI';

@Component({
  selector: 'app-empresa-template',
  templateUrl: './empresaTemplate.component.html',
  styleUrls: ['./empresaTemplate.component.css']
})
export class EmpresaTemplateComponent implements OnInit, AfterViewInit, AfterViewChecked {

  @Input() idEmpresa: number;
  @ViewChild('templateEmpresa') templateEmpresa: any;

  novo = false;
  editar = false;

  cadastroEmpresa: FormGroup;
  empresa: Empresa;

  status = ['ATIVO', 'INATIVO'];
  statusSelecionado: string;

  cidades: Cidade[];
  cidadeIdSelecionado: any;

  estados: Estado[];
  estadoIdSelecionado: any;

  valueCnpjCpfPipe = '';
  valueCepPipe = '';
  valueCelularPipe = '';
  valueTelefonePipe = '';
  valueIePipe = '';

  arquivoLogo: File;
  baseURLLogo = '';
  nomeArquivoLogo = '';

  templateEnabled = false;

  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              public dataService: DataService,
              private cidadeService: CidadeService,
              private estadoService: EstadoService,
              private permissaoService: PermissaoService,
              private changeDetectionRef: ChangeDetectorRef,
              private empresaService: EmpresaService) {
              }

  ngOnInit() {
    this.getEstados();
    this.estadoIdSelecionado = 11;
    this.getCidades(this.estadoIdSelecionado);
    this.validarEmpresa();
    if (this.idEmpresa !== 0) {
      this.carregarEmpresa();
    }
  }

  ngAfterViewChecked() {
    this.changeDetectionRef.detectChanges();
  }

  ngAfterViewInit() {
    this.permissaoService.getPermissoesByFormulario(
      Object.assign({formulario: 'EMPRESAS'})).subscribe((_PERMISSOES: Permissao[]) => {
      this.novo = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'NOVO')[0]);
      this.editar = this.permissaoService.verificarPermissao(_PERMISSOES.filter(c => c.acao === 'EDITAR')[0]);
    });
  }

  carregarEmpresa() {
    this.empresa = null;
    this.empresaService.getEmpresaById(this.idEmpresa)
    .subscribe(
    (_EMPRESA: Empresa) => {
      this.empresa = Object.assign(_EMPRESA);
      this.statusSelecionado = this.empresa.status;
      this.nomeArquivoLogo = this.empresa.nomeArquivoLogo;
      this.baseURLLogo = InfoAPI.URL + '/api/empresas/' + this.empresa.id + '/logo/' + this.empresa.nomeArquivoLogo;

      this.cadastroEmpresa.patchValue(this.empresa);
    }, error => {
      this.toastr.error(`Erro ao tentar carregar Empresa: ${error.error}`);
      console.log(error);
    });
  }

  validarEmpresa() {
    this.cadastroEmpresa = this.fb.group({
      id:  [''],
      razaoSocial: ['', Validators.required],
      nomeFantasia: ['', Validators.required],
      telefone: ['', Validators.required],
      cnpjCpf: ['', Validators.required],
      ie: [''],
      estadoId: [0, Validators.required],
      cidadeId: [0, Validators.required],
      cep: ['', Validators.required],
      endereco: ['', Validators.required],
      bairro: ['', Validators.required],
      nomeArquivoLogo: [''],
      status: ['', Validators.required]
    });
  }

  alterarNomeArquivoLogo(event) {
    if (event.target.files && event.target.files.length) {
      this.arquivoLogo = event.target.files[0];
      this.nomeArquivoLogo = event.target.value.split('\\', 3)[2];
      const reader = new FileReader();
      reader.onload = e => this.baseURLLogo = reader.result.toString();
      reader.readAsDataURL(this.arquivoLogo);
    }
  }

  editarEmpresa() {
    this.empresaService.editarEmpresa(this.empresa).subscribe(
      () => {
        this.toastr.success(`Editado com Sucesso!`);
      }, error => {
        console.log(error.error);
      }
    );
  }

  salvarEmpresa(template: any) {
    if (this.idEmpresa === 0) {
      this.empresa = Object.assign(this.cadastroEmpresa.value, {id: 0});
      this.empresaService.novaEmpresa(this.empresa).subscribe(
        () => {
          this.fecharTemplate(template);
          this.toastr.success(`Cadastrado com Sucesso!`);
        }, error => {
          console.log(error.error);
        });
    } else {
      this.empresa = Object.assign(this.cadastroEmpresa.value, { nomeArquivoLogo: this.nomeArquivoLogo });
      if (this.arquivoLogo) {
        this.empresaService.enviarLogo(this.empresa.id, this.arquivoLogo, this.empresa.nomeArquivoLogo).subscribe((result: any) => {
          if (result.retorno.toString() === 'EXTENSAO INVALIDA') {
            this.toastr.error(`Logo não atualizada. Apenas Imagens com extensão (.png | .jpg | .bmp) podem ser usadas!`);
          } else if (result.retorno.toString() === 'OK') {
            this.arquivoLogo = null;
            this.editarEmpresa();
          }
        });
      } else {
        this.editarEmpresa();
      }
    }
  }

  abrirTemplate(template: any) {
    if (this.templateEnabled === false) {
      template.show();
      this.templateEnabled = true;
    }
  }

  fecharTemplate(template: any) {
    template.hide();
    this.empresaService.setEmpresaTemplateStatus(false);
    this.templateEnabled = false;
  }

  getEstados() {
    this.estadoService.getEstados().subscribe(
      (_ESTADOS: Estado[]) => {
      this.estados = _ESTADOS;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar estados: ${error.error}`);
    });
  }

  getCidades(EstadoId: number) {
    if (EstadoId != null) {
      this.cidadeService.getCidadeByEstadoId(EstadoId).subscribe(
        (_CIDADES: Cidade[]) => {
        this.cidades = _CIDADES;
      }, error => {
        console.log(error.error);
        this.toastr.error(`Erro ao tentar carregar cidades: ${error.error}`);
      });
    }
  }

  limparEstado() {
    this.cidades = [];
    this.estadoIdSelecionado = [];
  }

}
