import { Usuario } from '../Cadastros/Usuarios/Usuario';
import { Publicacao } from './Publicacao';

export class PublicacaoUsuarioMarcacoes {
    publicacaoId: number;
    publicacao: Publicacao;
    usuarioId: number;
    usuario: Usuario;
}
