import { FormaPagamento } from '../../Cadastros/FormaPagamento/FormaPagamento';

export class RecebimentoParcelas {
    id: number;
    documento: string;
    recebimentosId: number;
    valor: number;
    valorRecebido: number;
    formaPagamentoId: number;
    formaPagamento: FormaPagamento;
    dataVencimento: Date;
    dataRecebimento: Date;
    status: string;
    dataLancamento: Date;
    numeroParcela: number;
}
