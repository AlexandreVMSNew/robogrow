import { FormaPagamento } from '../../Cadastros/FormaPagamento/FormaPagamento';

export class PagamentoParcelas {
    id: number;
    documento: string;
    pagamentosId: number;
    valor: number;
    valorPago: number;
    formaPagamentoId: number;
    formaPagamento: FormaPagamento;
    dataVencimento: Date;
    dataPagamento: Date;
    status: string;
    dataLancamento: Date;
    numeroParcela: number;
}
