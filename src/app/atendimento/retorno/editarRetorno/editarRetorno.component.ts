import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Retorno } from 'src/app/_models/Atendimentos/Retornos/retorno';
import { Cliente } from 'src/app/_models/Cadastros/Clientes/Cliente';
import { ToastrService } from 'ngx-toastr';
import { ClienteService } from 'src/app/_services/Cadastros/Clientes/cliente.service';
import { RetornoService } from 'src/app/_services/Atendimentos/Retornos/retorno.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editar-retorno',
  templateUrl: './editarRetorno.component.html'
})
export class EditarRetornoComponent implements OnInit {

  cadastroForm: FormGroup;
  retorno: Retorno;

  prioridades = ['NORMAL', 'URGENTE'];
  prioridadeSelecionado: string;

  cliente: Cliente;
  clientes: Cliente[];
  clienteIdSelecionado: any;

  valueTelefonePipe = '';

  dataHoraAtual: string;

  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private clienteServices: ClienteService,
              private retornoServices: RetornoService,
              private router: Router) { }

  ngOnInit() {
  }

  salvarAlteracoes() {

  }

}
