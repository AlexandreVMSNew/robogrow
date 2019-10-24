import { Cliente } from '../../Cadastros/Clientes/Cliente';

export class RelatorioVendasDetalhadas {
    id: number;
    numeroAno: string;
    clientesId: number;
    clientes: Cliente;
    status: string;
    dataNegociacao: Date;
    valorBrutoReceitas: number;
    valorBrutoDespesasGastos: number;
    valorBrutoDespesasComissao: number;
    valorLiquidoResultado: number;
}
