import { RecebimentoParcelas } from './RecebimentoParcelas';
import { Cliente } from '../../Cadastros/Clientes/Cliente';
import { PlanoPagamento } from '../../Cadastros/PlanoPagamento/PlanoPagamento';
import { ProdutoItem } from '../../Cadastros/Produtos/produtoItem';

export class Recebimentos {
    id: number;
    vendaId: number;
    clientesId: number;
    clientes: Cliente;
    dataEmissao: Date;
    dataCompetencia: Date;
    qtdParcelas: number;
    valorTotal: number;
    produtosItens: ProdutoItem;
    produtosItensId: number;
    planoPagamentoId: number;
    planoPagamento: PlanoPagamento;
    centroReceitaId: number;
    planoContasId: number;
    parcelas: RecebimentoParcelas[];
}
