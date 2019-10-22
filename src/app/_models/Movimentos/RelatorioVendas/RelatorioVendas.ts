import { RelatorioGraficoResultadoPorMes } from './RelatorioGraficoResultadoPorMes';

export class RelatorioVendas {
    qtdEmNegociacao: number;
    qtdAImplantar: number;
    qtdEmImplantacao: number;
    qtdFinalizado: number;
    qtdDistratado: number;
    qtdTotal: number;
    valorBrutoReceitas: number;
    valorBrutoDespesas: number;
    valorLiquidoResultado: number;
    valorMedio: number;
    valorTop: number;
    graficoResultadoPorMes: RelatorioGraficoResultadoPorMes[];
}
