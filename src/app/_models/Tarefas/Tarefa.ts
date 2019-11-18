import { Usuario } from '../Cadastros/Usuarios/Usuario';
import { TarefaCategorias } from './TarefaCategorias';
import { Nivel } from '../Cadastros/Usuarios/Nivel';
import { TarefaAnexos } from './TarefaAnexos';
import { TarefaAcoes } from './TarefaAcoes';

export class Tarefa {
    id: number;
    usuarioSolicitanteId: number;
    usuarioSolicitante: Usuario;
    tarefaCategoriaId: number;
    tarefaCategoria: TarefaCategorias;
    usuarioSolicitadoId: number;
    usuarioSolicitado: Usuario;
    nivelSolicitadoId: number;
    nivelSolicitado: Nivel;
    descricao: string;
    dataHora: Date;
    dataHoraPrazo: Date;
    dataHoraFinalizada: Date;
    usuarioCumpridorId: number;
    usuarioCumpridor: Usuario;
    finalizada: boolean;
    tarefaAnexos: TarefaAnexos[];
    tarefaAcoes: TarefaAcoes[];
}
