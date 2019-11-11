import { Usuario } from '../Cadastros/Usuarios/Usuario';
import { PublicacaoComentario } from './PublicacaoComentario';
import { PublicacaoArquivos } from './PublicacaoArquivos';
import { PublicacaoUsuarioMarcacoes } from './PublicacaoUsuarioMarcacoes';
import { VendaPublicacao } from '../Movimentos/Venda/VendaPublicacao';
import { PublicacaoNivelMarcacoes } from './PublicacaoNivelMarcacoes';
export class Publicacao {
    id: number;
    usuarioId: number;
    usuario: Usuario;
    texto: string;
    compartilharTodos: boolean;
    dataHora: Date;
    dataHoraAlteracao: Date;
    textoComentario: string;
    vendaPublicacao: VendaPublicacao[];
    publicacaoComentarios: PublicacaoComentario[];
    publicacaoArquivos: PublicacaoArquivos[];
    publicacaoUsuarioMarcacoes: PublicacaoUsuarioMarcacoes[];
    publicacaoNivelMarcacoes: PublicacaoNivelMarcacoes[];
}
