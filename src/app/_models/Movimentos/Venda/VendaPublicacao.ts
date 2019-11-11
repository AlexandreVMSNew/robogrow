import { Venda } from './Venda';
import { Publicacao } from '../../Publicacoes/Publicacao';

export class VendaPublicacao {
    vendaId: number;
    venda: Venda;
    publicacaoId: number;
    publicacao: Publicacao;
}
