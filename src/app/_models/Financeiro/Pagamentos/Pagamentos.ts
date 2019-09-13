import { PagamentoParcelas } from './PagamentoParcelas';
import { PlanoContas } from '../../Cadastros/PlanoContas/planoContas';
import { Pessoa } from '../../Cadastros/Pessoas/Pessoa';
import { ProdutoItem } from '../../Cadastros/Produtos/produtoItem';

export class Pagamentos {
    id: number;
    vendaId: number;
    pessoasId: number;
    pessoas: Pessoa;
    dataEmissao: Date;
    dataCompetencia: Date;
    qtdParcelas: number;
    valorTotal: number;
    produtosItens: ProdutoItem;
    produtosItensId: number;
    planoPagamentoId: number;
    centroDespesaId: number;
    planoContasId: number;
    planoContas: PlanoContas;
    parcelas: PagamentoParcelas[];
}
