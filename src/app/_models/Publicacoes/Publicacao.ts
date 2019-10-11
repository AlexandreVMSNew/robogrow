import { Usuario } from '../Cadastros/Usuarios/Usuario';
import { PublicacaoComentario } from './publicacaoComentario';
export class Publicacao {
    id: number;
    usuarioId: number;
    usuario: Usuario;
    texto: string;
    dataHora: Date;
    dataHoraAlteracao: Date;
    publicacaoComentarios: PublicacaoComentario[];
}
