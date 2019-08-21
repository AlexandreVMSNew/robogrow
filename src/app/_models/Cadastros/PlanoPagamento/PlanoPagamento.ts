import { FormaPagamento } from '../FormaPagamento/FormaPagamento';
import { PlanoContas } from '../PlanoContas/planoContas';

export class PlanoPagamento {
    id: number;
    formaPagamentoId: number;
    formaPagamento: FormaPagamento;
    qtdParcelas: string;
    prazoPrimeiraParcela: string;
    intervaloParcelas: string;
    juros: number;
    desconto: number;
    planoContasId: number;
    planoContas: PlanoContas;
    status: string;
}
