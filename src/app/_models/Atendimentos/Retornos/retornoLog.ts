import { Usuario } from 'src/app/_models/Cadastros/Usuarios/Usuario';

export class RetornoLog {
    id: number;
    retornoId: number;
    usuarioId: number;
    usuario: Usuario;
    dataHora: string;
    status: string;
}
