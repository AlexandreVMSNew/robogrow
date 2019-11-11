import { Usuario } from '../Cadastros/Usuarios/Usuario';

export class PublicacaoComentario {
    id: number;
    publicacaoId: number;
    usuarioId: number;
    usuario: Usuario;
    texto: string;
    dataHora: Date;
    dataHoraAlteracao: Date;
}
