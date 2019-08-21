import { Recebimentos } from '../../Financeiro/Recebimentos/Recebimentos';
import { Pagamentos } from '../../Financeiro/Pagamentos/Pagamentos';

export class VendaValorRealizado {
    id: number;
    vendaId: number;
    produtosItensId: number;
    recebimentosId: number;
    recebimentos: Recebimentos;
    pagamentosId: number;
    pagamentos: Pagamentos;
}
