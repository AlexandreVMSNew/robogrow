import { Usuario } from '../Cadastros/Usuarios/Usuario';

export class Notificacao {
    id: number;
    usuarioId: number;
    usuario: Usuario;
    tipo: string;
    dataHora: Date;
    visto: number;
}
