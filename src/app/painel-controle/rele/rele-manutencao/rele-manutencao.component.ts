import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReleService } from 'src/app/_services/Painel-Controle/Rele/rele.service';
import { ToastrService } from 'ngx-toastr';
import { Rele } from 'src/app/_models/Painel-Controle/Rele/Rele';
import { HoraMinutoPipe } from 'src/app/pipes/hora-minuto.pipe';

@Component({
  selector: 'app-rele-manutencao',
  templateUrl: './rele-manutencao.component.html',
  styleUrls: ['./rele-manutencao.component.css']
})
export class ReleManutencaoComponent implements OnInit {

  @Input() rele: Rele;

  cadastroReleForm: FormGroup;

  automaticoSelecionado = 0;
  statusSelecionado = 0;

  modoSalvar = '';

  itensAutomatico = [
    {
      label: 'SIM',
      value: 1
    },
    {
      label: 'NÃO',
      value: 0
    },
  ];

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

  constructor(private releService: ReleService,
              private fb: FormBuilder,
              private toastr: ToastrService) {}

  ngOnInit() {
    this.validarRele();
    if (this.rele !== null) {
      this.modoSalvar = 'EDITAR';
      this.carregarRele();
    } else {
      this.modoSalvar = 'CADASTRAR';
    }
  }

  carregarRele() {
    this.cadastroReleForm.patchValue(this.rele);
    this.automaticoSelecionado = this.rele.automatico;
    this.statusSelecionado = this.rele.status;
  }

  validarRele() {
    this.cadastroReleForm = this.fb.group({
      id:  [''],
      descricao: ['', Validators.required],
      horaMinutoLiga: ['', Validators.required],
      horaMinutoDesliga: ['', Validators.required],
      automatico: ['', Validators.required],
      pinoSaida: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  editarRele() {
    this.rele = Object.assign(this.cadastroReleForm.value);
    this.rele = Object.assign(this.rele, {
      horaLiga: Number(this.rele.horaMinutoLiga.split(':')[0]),
      minutoLiga: Number(this.rele.horaMinutoLiga.split(':')[1]),
      horaDesliga: Number(this.rele.horaMinutoDesliga.split(':')[0]),
      minutoDesliga: Number(this.rele.horaMinutoDesliga.split(':')[1])
    });

    console.log(this.rele);

    this.releService.editarRele(this.rele).subscribe((reles: Rele[]) => {
      this.toastr.success('Editado com Sucesso!');
      this.releService.atualizarReles(reles);
    }, error => {
      console.log(error.error);
    });
  }

  cadastrarRele() {
    this.rele = Object.assign(this.cadastroReleForm.value);
    this.rele = Object.assign(this.rele, {
      id: 0,
      horaLiga: Number(this.rele.horaMinutoLiga.split(':')[0]),
      minutoLiga: Number(this.rele.horaMinutoLiga.split(':')[1]),
      horaDesliga: Number(this.rele.horaMinutoDesliga.split(':')[0]),
      minutoDesliga: Number(this.rele.horaMinutoDesliga.split(':')[1])
    });

    console.log(this.rele);

    this.releService.cadastrarRele(this.rele).subscribe((reles: Rele[]) => {
      this.toastr.success('Cadastrado com Sucesso!');
      this.releService.atualizarReles(reles);
    }, error => {
      console.log(error.error);
    });
  }


}
