import { Usuario } from '../../Cadastros/Usuarios/Usuario';

export class RetornoObservacao {
    id: number;
    retornoId: number;
    usuarioId: number;
    usuario: Usuario;
    dataHora: string;
    observacao: string;
}
