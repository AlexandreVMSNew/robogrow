import { Component, OnInit, Input } from '@angular/core';
import { Tarefa } from 'src/app/_models/Tarefas/Tarefa';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Nivel } from 'src/app/_models/Cadastros/Usuarios/Nivel';
import { Usuario } from 'src/app/_models/Cadastros/Usuarios/Usuario';
import { TarefaService } from 'src/app/_services/Tarefas/tarefa.service';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from 'src/app/_services/Cadastros/Usuarios/usuario.service';
import { VendaService } from 'src/app/_services/Movimentos/Venda/venda.service';
import { PermissaoService } from 'src/app/_services/Permissoes/permissao.service';
import { SocketService } from 'src/app/_services/WebSocket/Socket.service';
import { NotificacaoService } from 'src/app/_services/Notificacoes/notificacao.service';
import { EmailService } from 'src/app/_services/Email/email.service';

@Component({
  selector: 'app-tarefa-cadastro',
  templateUrl: './tarefaCadastro.component.html',
  styleUrls: ['./tarefaCadastro.component.css']
})
export class TarefaCadastroComponent implements OnInit {

  @Input() vendaId: number;
  @Input() tarefa: Tarefa = null;

  cadastroTarefaForm: FormGroup;

  niveis: Nivel[] = [];
  nivelIdSelecionado: number;

  usuarios: Usuario[];
  usuarioSolicitadoIdSelecionado: number;
  usuarioLogado: Usuario;

  modoSalvar = '';

  marcacaoTipoSelecionado: any;

  itensCompartilharTodos = [
    {
      label: 'TODOS',
      value: 'TODOS'
    },
    {
      label: 'MARCAR USUÁRIOS ESPECÍFICOS',
      value: 'USUARIO'
    },
    {
      label: 'MARCAR NÍVEIS ESPECÍFICOS',
      value: 'NIVEL'
    }
  ];

  constructor(private tarefaService: TarefaService,
              private fb: FormBuilder,
              private toastr: ToastrService,
              private usuarioService: UsuarioService,
              private vendaService: VendaService,
              private permissaoService: PermissaoService,
              private socketService: SocketService,
              private notificacaoService: NotificacaoService,
              private emailService: EmailService) { }

  ngOnInit() {
    
  }

  validarPublicacao() {
    this.cadastroTarefaForm = this.fb.group({
      id:  [''],
      tarefaCategoriaId:  [''],
      usuarioSolicitadoId:  [''],
      nivelSolicitadoId:  [''],
      descricao: ['', Validators.required],
      dataHoraPrazo: ['', Validators.required]
    });
  }


  getUrlUsuarioFotoPerfil(usuarioId, nomeArquivoFotoPerfil) {
    return this.usuarioService.getUrlUsuarioFotoPerfil(usuarioId, nomeArquivoFotoPerfil);
  }
}
