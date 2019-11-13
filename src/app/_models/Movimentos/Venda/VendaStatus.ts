import { VendaStatusPermissao } from './VendaStatusPermissao';
import { Venda } from './Venda';

export class VendaStatus {
    id: number;
    descricao: string;
    posicao: number;
    badgeCor: string;
    vendaStatusPermissao: VendaStatusPermissao[];
    vendas: Venda[];
}
