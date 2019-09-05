import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UsuarioService } from '../_services/Cadastros/Usuarios/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { Nivel } from '../_models/Cadastros/Usuarios/Nivel';
import { PermissaoService } from '../_services/Permissoes/permissao.service';
import { Permissao } from '../_models/Permissoes/permissao';
import { NiveisPermissao } from '../_models/Permissoes/niveisPermissao';
import { PermissaoNivel } from '../_models/Permissoes/permissaoNivel';

@Component({
  selector: 'app-permissao',
  templateUrl: './permissao.component.html'
})
export class PermissaoComponent implements OnInit, AfterViewInit {

  formularios: any =
  [
    {
      nome: 'EMPRESAS'
    },
    {
      nome: 'USUARIOS'
    },
    {
      nome: 'CLIENTES'
    },
    {
      nome: 'PESSOAS'
    },
    {
      nome: 'PRODUTOS'
    },
    {
      nome: 'PLANO DE CONTAS'
    },
    {
      nome: 'CENTRO DE RECEITA'
    },
    {
      nome: 'CENTRO DE DESPESA'
    },
    {
      nome: 'PLANO DE PAGAMENTO'
    },
    {
      nome: 'FORMA DE PAGAMENTO'
    },
    {
      nome: 'FINANCEIRO'
    },
    {
      nome: 'RECEBIMENTOS'
    },
    {
      nome: 'PAGAMENTOS'
    },
    {
      nome: 'LANÇAMENTOS'
    },
    {
      nome: 'RELATÓRIOS LANÇAMENTOS'
    },
    {
      nome: 'CHEQUES PRE-DATADO'
    },
    {
      nome: 'VENDA'
    },
    {
      nome: 'RELATÓRIOS VENDA'
    },
    {
      nome: 'PERMISSOES'
    }
  ];

  niveis: Nivel[];
  editar = false;

  formularioSelecionado: any;
  permissoesFormulario: Permissao[];
  niveisPermissao: NiveisPermissao[] = [];
  controllerPermissaoNivel: PermissaoNivel[] = [];
  constructor(private usuarioService: UsuarioService,
              private toastr: ToastrService,
              private permissaoService: PermissaoService) { }

  ngOnInit() {
    this.getNiveis();
  }

  ngAfterViewInit() {
    this.permissaoService.getPermissoesByFormularioAcaoObjeto('PERMISSOES', 'EDITAR').subscribe((_PERMISSAO: Permissao) => {
      this.editar = this.permissaoService.verificarPermissao(_PERMISSAO);
    });
  }

  getPermissoesFormularios() {
    this.niveisPermissao = [];
    let niveisConst;
    this.permissaoService.getPermissoesByFormulario(this.formularioSelecionado)
    .subscribe((_PERMISSOES: Permissao[]) => {
      this.permissoesFormulario = _PERMISSOES;
      _PERMISSOES.forEach(permissao => {
        niveisConst = [];
        permissao.permissaoNiveis.forEach(nivel => {
          niveisConst.push(nivel.nivelId);
        });
        this.niveisPermissao.push(Object.assign({permissaoId: permissao.id, niveis: niveisConst}));
      });
    });
  }

  setNiveisPermissao(idPermissao: number, niveis: any) {
    let niveisConst: any;
    if (niveis) {
      niveisConst = [];
      niveis.forEach(nivel => {
        niveisConst.push(nivel.id);
      });
      if (this.niveisPermissao.filter(c => c.permissaoId === idPermissao)[0]) {
        this.niveisPermissao.forEach(np => {
          if (np.permissaoId === idPermissao) {
            if (niveisConst !== np.niveis) {
              np.niveis = niveisConst;
            }
          }
        });
      } else {
        this.niveisPermissao.push(Object.assign({permissaoId: idPermissao, niveis: niveisConst}));
      }
    }
  }

  getNiveisPermissao(idPermissao: number) {
    if (this.niveisPermissao.filter(c => c.permissaoId === idPermissao).length > 0) {
      return this.niveisPermissao.filter(c => c.permissaoId === idPermissao)[0].niveis;
    } else {
      return null;
    }
  }

  salvarAlteracao() {
    let verificaErro = false;
    this.controllerPermissaoNivel = [];
    this.niveisPermissao.forEach(np => {

      if (np.niveis.length > 0) {
        np.niveis.forEach(nivel => {
          const obj = Object.assign({permissaoId: np.permissaoId, nivelId: nivel});
          this.controllerPermissaoNivel.push(obj);
        });

        if (np.niveis.filter(c => c === 1).length === 0) {
          const obj = Object.assign({permissaoId: np.permissaoId, nivelId: 1});
          this.controllerPermissaoNivel.push(obj);
        }
      } else {
        const obj = Object.assign({permissaoId: np.permissaoId, nivelId: 1});
        this.controllerPermissaoNivel.push(obj);
      }

      this.permissaoService.editarNiveisPermissoes(this.formularioSelecionado, this.controllerPermissaoNivel)
      .subscribe( () => {
      }, error => {
        verificaErro = true;
        this.toastr.error(`Erro ao tentar alterar Permissões: ${error.error}`);
        console.log(error.error);
      });
      this.controllerPermissaoNivel = [];
    });
    if (verificaErro === false) {
      this.toastr.success(`Permissões alteradas com Sucesso!`);
    }
  }

  getNiveis() {
    this.niveis = [];
    this.usuarioService.getAllNiveis().subscribe(
      (_NIVEIS: Nivel[]) => {
      this.niveis = _NIVEIS;
    }, error => {
      console.log(error.error);
      this.toastr.error(`Erro ao tentar carregar niveis: ${error.error}`);
    });
  }

}
