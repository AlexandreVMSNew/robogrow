import { Usuario } from '../Cadastros/Usuarios/Usuario';

export class Autorizacao {
    id: number;
    solicitanteId: number;
    solicitante: Usuario;
    autorizadorId: number;
    autorizador: Usuario;
    formularioId: number;
    formularioIdentificacao: string;
    formulario: string;
    acao: string;
    objeto: string;
    observacoes: string;
    dataHoraSolicitado: number;
    dataHoraAutorizado: string;
    autorizado: number;
    visto: number;

}
