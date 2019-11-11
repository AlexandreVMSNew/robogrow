import { Usuario } from '../Cadastros/Usuarios/Usuario';

export class Notificacao {
    id: number;
    notificanteId: number;
    notificante: Usuario;
    notificadoId: number;
    tipo: string;
    acao: string;
    mensagem: string;
    toolTip: string;
    componentIdentificacao: string;
    icone: string;
    toolTipIcone: string;
    corIcone: string;
    compartilharTodos: boolean;
    dataHora: Date;
    visto: number;
}
