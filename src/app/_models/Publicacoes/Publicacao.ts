import { Usuario } from '../Cadastros/Usuarios/Usuario';
import { PublicacaoComentario } from './PublicacaoComentario';
import { PublicacaoArquivos } from './PublicacaoArquivos';
import { PublicacaoMarcacoes } from './PublicacaoMarcacoes';
import { VendaPublicacao } from '../Movimentos/Venda/VendaPublicacao';
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
    publicacaoMarcacoes: PublicacaoMarcacoes[];
}
