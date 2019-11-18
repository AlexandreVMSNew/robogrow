import { Tarefa } from './Tarefa';
import { Usuario } from '../Cadastros/Usuarios/Usuario';

export class TarefaAcoes {
    id: number;
    tarefaId: number;
    tarefa: Tarefa;
    usuarioId: number;
    usuario: Usuario;
    descricao: string;
    dataHora: Date;
}
