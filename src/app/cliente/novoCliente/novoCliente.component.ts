import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Cliente } from 'src/app/_models/Cliente';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/_services/cliente.service';
import { EstadoService } from 'src/app/_services/estado.service';
import { CidadeService } from 'src/app/_services/cidade.service';
import { Estado } from 'src/app/_models/Estado';
import { Cidade } from 'src/app/_models/Cidade';

@Component({
  selector: 'app-novo-cliente',
  templateUrl: './novoCliente.component.html',
  styleUrls: ['./novoCliente.component.css']
})
export class NovoClienteComponent implements OnInit {

  titulo = 'Cadastrar';
  cadastroForm: FormGroup;
  cliente: Cliente;

  estados: Estado[];
  estadoIdSelecionado: any;
  cidadeIdSelecionado: any;
  cidades: Cidade[];

  valueCnpjCpfPipe = '';
  valueCepPipe = '';
  valueCelularPipe = '';
  valueTelefonePipe = '';
  valueIePipe = '';

  constructor(public fb: FormBuilder,
              private estadoService: EstadoService,
              private cidadeService: CidadeService,
              private toastr: ToastrService,
              private clienteService: ClienteService,
              public router: Router,
              private changeDetectionRef: ChangeDetectorRef) {
               }

  ngOnInit() {
    this.getEstados();
    this.validation();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewChecked() {
    this.changeDetectionRef.detectChanges();
  }

  validation() {
    this.cadastroForm = this.fb.group({
        id:  [''],
        codSiga: [''],
        nLoja: [''],
        razaoSocial: ['', Validators.required],
        nomeFantasia: ['', Validators.required],
        proprietario: [''],
        gerente: [''],
        telefone: ['', Validators.required],
        celular: [''],
        cnpjCpf: ['', Validators.required],
        iE: [''],
        estadoId: [0, Validators.required],
        cidadeId: [0, Validators.required],
        cep: ['', Validators.required],
        endereco: ['', Validators.required],
        bairro: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        grupo: [''],
        status: ['']
    });
  }

  getEstados() {
    this.estadoService.getAllEstados().subscribe(
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

  limparCidade() {
    this.cadastroForm.patchValue({
      cidadeId: ''
    });
  }

  limparEstado() {
    this.cidades = [];
    this.cadastroForm.patchValue({
      estadoId: '',
      cidadeId: ''
    });
  }

  cadastrarCliente() {
    if (this.cadastroForm.valid) {
      this.cliente = Object.assign(this.cadastroForm.value, {id: 0});
      this.clienteService.novoCliente(this.cliente).subscribe(
        () => {
          this.toastr.success('Cadastro Realizado!');
        }, error => {
          const erro = error.error;
          console.log(error.error);
        }
      );
    }
  }

}
