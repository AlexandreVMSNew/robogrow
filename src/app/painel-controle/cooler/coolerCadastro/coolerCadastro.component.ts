import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Cooler } from 'src/app/_models/Painel-Controle/Cooler/Cooler';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CoolerService } from 'src/app/_services/Painel-Controle/Cooler/cooler.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-cooler-cadastro',
  templateUrl: './coolerCadastro.component.html',
  styleUrls: ['./coolerCadastro.component.css']
})
export class CoolerCadastroComponent implements OnInit {

  @Input() cooler: Cooler = null;

  cadastroCoolerForm: FormGroup;

  sentidoSelecionado: string;
  statusSelecionado: number;

  modoSalvar = '';

  itensSentido = ['ENTRANDO', 'SAINDO' ];
  itensStatus = [
    {
      label: 'LIGADO',
      value: 1
    },
    {
      label: 'DESLIGADO',
      value: 0
    },
  ];
  constructor(private coolerService: CoolerService,
              private fb: FormBuilder,
              private toastr: ToastrService) {}

  ngOnInit() {
    this.validarCooler();
    if (this.cooler !== null) {
      this.modoSalvar = 'EDITAR';
      this.carregarCooler();
    } else {
      this.modoSalvar = 'CADASTRAR';
    }
  }

  carregarCooler() {
    this.cadastroCoolerForm.patchValue(this.cooler);
    this.sentidoSelecionado = this.cooler.sentido;
    this.statusSelecionado = this.cooler.status;
  }

  validarCooler() {
    this.cadastroCoolerForm = this.fb.group({
      id:  [''],
      descricao: ['', Validators.required],
      sentido: ['', Validators.required],
      velocidade: ['', Validators.required],
      pinoEntradaA: ['', Validators.required],
      pinoEntradaB: ['', Validators.required],
      pinoEntradaVelocidade: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  editarCooler() {
    this.cooler = Object.assign(this.cadastroCoolerForm.value);
    console.log(this.cooler);

    this.coolerService.editarCooler(this.cooler).subscribe(() => {
      this.toastr.success('Editado com Sucesso!');
    }, error => {
      console.log(error.error);
    });
  }

  cadastrarCooler() {
    this.cooler = Object.assign(this.cadastroCoolerForm.value, {id: 0});
    console.log(this.cooler);

    this.coolerService.cadastrarCooler(this.cooler).subscribe(() => {
      this.toastr.success('Cadastrado com Sucesso!');
    }, error => {
      console.log(error.error);
    });
  }

}
