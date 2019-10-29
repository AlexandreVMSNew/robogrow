import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChequePre } from 'src/app/_models/Cadastros/ChequePre/ChequePre';
import { BsDatepickerConfig, BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/_services/Cadastros/Uteis/data.service';
import { ChequePreService } from 'src/app/_services/Cadastros/ChequePre/chequePre.service';
import { Cliente } from 'src/app/_models/Cadastros/Clientes/Cliente';
import { ClienteService } from 'src/app/_services/Cadastros/Clientes/cliente.service';
import * as moment from 'moment';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { Permissao } from 'src/app/_models/Permissoes/permissao';
import { PermissaoObjetos } from 'src/app/_models/Permissoes/permissaoObjetos';

@Component({
  selector: 'app-cheque-pre-template',
  templateUrl: './chequePreTemplate.component.html',
  styleUrls: ['./chequePreTemplate.component.css']
})
export class ChequePreTemplateComponent implements OnInit, AfterViewInit {

  @Input() idChequePre: number;
  @ViewChild('templateChequePre') templateChequePre: any;

  formularioComponent = 'CHEQUE PRÉ-DATADO';
  cadastrar = false;
  editar = false;
  listar = false;
  visualizar = false;
  excluir = false;

  cadastroCheque: FormGroup;
  cheque: ChequePre;

  templateEnabled = false;

  clientes: Cliente[];
  clienteIdSelecionado: any;

  bsConfig: Partial<BsDatepickerConfig> = Object.assign({}, { containerClass: 'theme-dark-blue' });
  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              public dataService: DataService,
              private clienteService: ClienteService,
              private permissaoService: PermissaoService,
              private chequePreService: ChequePreService) {
              }

  ngOnInit() {
    this.getClientes();
    this.validarChequePre();
    if (this.idChequePre !== 0) {
      this.carregarChequePre();
    }
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

  carregarChequePre() {
    this.cheque = null;
    this.chequePreService.getChequePreById(this.idChequePre)
      .subscribe(
        (_CHEQUE: ChequePre) => {
          this.cheque = Object.assign(_CHEQUE, {
            dataLancamento: this.dataService.getDataPTBR(_CHEQUE.dataLancamento),
            dataPreDatado: this.dataService.getDataPTBR(_CHEQUE.dataPreDatado)
          });

          this.cadastroCheque.patchValue(this.cheque);

          console.log(this.cheque);

        }, error => {
          this.toastr.error(`Erro ao tentar carregar ChequePre: ${error.error}`);
          console.log(error);
        });
  }

  validarChequePre() {
    this.cadastroCheque = this.fb.group({
        id:  [''],
        clientesId: ['', Validators.required],
        recebimentoParcelasId: [''],
        banco: ['', Validators.required],
        agencia: ['', Validators.required],
        conta: ['', Validators.required],
        numero: ['', Validators.required],
        valor: ['', [Validators.required, Validators.min(1)]],
        usuarioLancamentoid: [''],
        usuarioBaixaId: [''],
        status: [''],
        dataPreDatado: ['', Validators.required],
        dataLancamento: [''],
    });
  }

  salvarChequePre(template: any) {
    const dataAtual = moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    if (this.idChequePre === 0) {
      this.cheque = Object.assign(this.cadastroCheque.value, {id: 0,
          dataPreDatado: this.dataService.getDataSQL(this.cadastroCheque.get('dataPreDatado').value.toLocaleString()),
          dataLancamento: dataAtual});
      this.chequePreService.cadastrarChequePre(this.cheque).subscribe(
        () => {
          this.fecharTemplate(template);
          this.toastr.success(`Cadastrado com Sucesso!`);
        }, error => {
          console.log(error.error);
        });
    } else {
      this.cheque = Object.assign(this.cadastroCheque.value, {
        dataPreDatado: this.dataService.getDataSQL(this.cadastroCheque.get('dataPreDatado').value),
        dataLancamento: this.dataService.getDataSQL(this.cadastroCheque.get('dataLancamento').value)});
      this.chequePreService.editarChequePre(this.cheque).subscribe(
        () => {
          this.toastr.success(`Editado com Sucesso!`);
        }, error => {
          console.log(error.error);
        }
      );
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
    console.log(true);
    this.chequePreService.setChequePreTemplateStatus(false);
    this.templateEnabled = false;
  }

  getClientes() {
    this.clienteService.getCliente().subscribe(
      (_CLIENTES: Cliente[]) => {
      this.clientes = _CLIENTES.filter(cliente => cliente.status === 'ATIVO');
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar clientes: ${error.error}`);
    });
  }
}
