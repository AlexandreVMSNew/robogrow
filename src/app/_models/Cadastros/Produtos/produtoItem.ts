import { VendaValorRealizado } from '../../Movimentos/Venda/VendaValorRealizado';
import { VendaValorPrevisto } from '../../Movimentos/Venda/VendaValorPrevisto';

export class ProdutoItem {
    id: number;
    produtosId: number;
    tipoItem: string;
    subTipoItem: string;
    descricao: string;
    centroDespesaId: number;
    centroReceitaId: number;
    planoContasId: number;
    vendaValorRealizado: VendaValorRealizado[];
    vendaValorPrevisto: VendaValorPrevisto;
}
