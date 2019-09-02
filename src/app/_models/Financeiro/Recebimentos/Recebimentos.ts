import { RecebimentoParcelas } from './RecebimentoParcelas';
import { Cliente } from '../../Cadastros/Clientes/Cliente';
import { PlanoPagamento } from '../../Cadastros/PlanoPagamento/PlanoPagamento';

export class Recebimentos {
    id: number;
    vendaId: number;
    clientesId: number;
    clientes: Cliente;
    dataEmissao: Date;
    dataCompetencia: Date;
    qtdParcelas: number;
    valorTotal: number;
    produtosItensId: number;
    planoPagamentoId: number;
    planoPagamento: PlanoPagamento;
    centroReceitaId: number;
    planoContasId: number;
    parcelas: RecebimentoParcelas[];
}
