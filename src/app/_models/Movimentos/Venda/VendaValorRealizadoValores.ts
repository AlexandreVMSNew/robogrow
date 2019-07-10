import { Pessoa } from '../../Cadastros/Pessoas/Pessoa';

export class VendaValorRealizadoValores {
    id: number;
    pessoasId: number;
    pessoas: Pessoa;
    vendaValorRealizadoId: number;
    descricao: string;
    dataPagamento: Date;
    dataHoraUltAlt: Date;
    valor: number;
}
