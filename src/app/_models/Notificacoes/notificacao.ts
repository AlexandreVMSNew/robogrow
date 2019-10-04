import { Usuario } from '../Cadastros/Usuarios/Usuario';

export class Notificacao {
    id: number;
    usuarioId: number;
    usuario: Usuario;
    formularioId: number;
    formularioIdentificacao: string;
    titulo: string;
    mensagem: string;
    dataHora: Date;
    visto: number;
}
