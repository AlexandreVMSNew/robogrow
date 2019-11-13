import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VendaService } from 'src/app/_services/Movimentos/Venda/venda.service';
import { ToastrService } from 'ngx-toastr';
import { VendaStatus } from 'src/app/_models/Movimentos/Venda/VendaStatus';
import { Nivel } from 'src/app/_models/Cadastros/Usuarios/Nivel';
import { UsuarioService } from 'src/app/_services/Cadastros/Usuarios/usuario.service';
import { VendaStatusPermissao } from 'src/app/_models/Movimentos/Venda/VendaStatusPermissao';

@Component({
  selector: 'app-venda-status-cadastro',
  templateUrl: './vendaStatusCadastro.component.html',
  styleUrls: ['./vendaStatusCadastro.component.css']
})

export class VendaStatusCadastroComponent implements OnInit {

  @Input() vendaStatus: VendaStatus;

  vendaStatusCadastroForm: FormGroup;

  niveis: Nivel[] = [];

  vendaStatusPermissao: any = [];

  modoSalvar = '';

  constructor(private vendaService: VendaService,
              private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.getNiveis();
    this.validarVendaStatusForm();
    if (this.vendaStatus !== null) {
      this.modoSalvar = 'EDITAR';
      this.carregarVendaStatus();
    } else {
      this.modoSalvar = 'CADASTRAR';
    }
  }

  carregarVendaStatus() {
    this.vendaStatusPermissao = [];
    if (this.vendaStatus) {
      this.vendaStatusCadastroForm.patchValue(this.vendaStatus);

      if (this.vendaStatus.vendaStatusPermissao) {
        this.vendaStatus.vendaStatusPermissao.forEach((permissao: VendaStatusPermissao) => {
          this.vendaStatusPermissao.push(permissao.nivelId);
        });
      }
    }
  }

  validarVendaStatusForm() {
    this.vendaStatusCadastroForm = this.fb.group({
        id: [''],
        descricao: ['', Validators.required],
        posicao: ['', Validators.required],
        badgeCor: ['', Validators.required],
        vendaStatusPermissao: [''],
    });
  }

  cadastrarVendaStatus() {

    const permissao = [];
    this.vendaStatusPermissao.forEach((id: number) => {
      permissao.push(Object.assign({
        nivelId: id
      }));
    });

    this.vendaStatus = Object.assign(this.vendaStatusCadastroForm.value, {
      id: 0,
      vendaStatusPermissao: permissao,
    });

    this.vendaService.cadastrarVendaStatus(this.vendaStatus).subscribe(() => {
      this.toastr.success(`Cadastrado com sucesso!`);
      this.vendaService.atualizarVendaStatus();
    }, error => {
      console.log(error.error);
    });
  }

  editarVendaStatus() {

    const permissao = [];
    this.vendaStatusPermissao.forEach((id: number) => {
      permissao.push(Object.assign({
        vendaStatusId: this.vendaStatus.id,
        nivelId: id
      }));
    });

    this.vendaStatus = Object.assign(this.vendaStatusCadastroForm.value, {
      vendaStatusPermissao: permissao,
    });

    this.vendaService.editarVendaStatus(this.vendaStatus).subscribe(() => {
      this.toastr.success(`Editado com sucesso!`);
      this.vendaService.atualizarVendaStatus();
    }, error => {
      console.log(error.error);
    });
  }

  getNiveis() {
    this.usuarioService.getNiveis().subscribe((_NIVEIS: Nivel[]) => {
      this.niveis = _NIVEIS;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar niveis: ${error.error}`);
    });
  }
}
