import { Usuario } from '../Cadastros/Usuarios/Usuario';
import { PublicacaoComentario } from './PublicacaoComentario';
export class Publicacao {
    id: number;
    usuarioId: number;
    usuario: Usuario;
    texto: string;
    dataHora: Date;
    dataHoraAlteracao: Date;
    textoComentario: string;
    publicacaoComentarios: PublicacaoComentario[];
}
