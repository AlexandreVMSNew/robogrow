import { Component, OnInit } from '@angular/core';
import { Colaborador } from '../_models/Colaborador';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ColaboradorService } from '../_services/colaborador.service';
import { BsModalService, BsLocaleService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-colaborador',
  templateUrl: './colaborador.component.html',
  styleUrls: ['./colaborador.component.css']
})

export class ColaboradorComponent implements OnInit {

  colaboradoresFiltrados: Colaborador[];
  colaboradores: Colaborador[];
  colaborador: Colaborador;
  modoSalvar = '';
  cadastroForm: FormGroup;
  bodyDeletarColaborador = '';

  // tslint:disable-next-line:variable-name
  _filtroLista: string;

  constructor(
    private colaboradorService: ColaboradorService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private toastr: ToastrService
    ) {
      this.localeService.use('pt-br');
    }

  get filtroLista() {
    return this._filtroLista;
  }

  set filtroLista(value: string) {
    this._filtroLista = value;
    this.colaboradoresFiltrados = this.filtroLista ? this.filtrarColaboradores(this.filtroLista) : this.colaboradores;
  }

  excluirColaborador(colaborador: Colaborador, template: any) {
    this.colaborador = colaborador;
    this.bodyDeletarColaborador = `Tem certeza que deseja excluir o Colaborador: ${colaborador.userName}, Código: ${colaborador.id}`;
  }

  confirmeDelete(template: any) {
    this.colaboradorService.deletarColaborador(this.colaborador.id).subscribe(
    () => {
        template.hide();
        this.getColaboradores();
        this.toastr.success('Excluído com sucesso!');
      }, error => {
        this.toastr.error(`Erro ao tentar Excluir: ${error}`);
      });
  }

  ngOnInit() {
    this.getColaboradores();
  }

  filtrarColaboradores(filtrarPor: string): Colaborador[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.colaboradores.filter(
      colaborador => colaborador.userName.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  getColaboradores() {
      this.colaboradorService.getAllColaborador().subscribe(
        // tslint:disable-next-line:variable-name
        (_colaboradores: Colaborador[]) => {
        this.colaboradores = _colaboradores;
        this.colaboradoresFiltrados = this.colaboradores;
      }, error => {
        this.toastr.error(`Erro ao tentar carregar colaboradores: ${error}`);
      });
  }
}
