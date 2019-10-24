import { RelatorioGraficoResultadoPorMes } from './RelatorioGraficoResultadoPorMes';
import { RelatorioVendasDetalhadas } from './RelatorioVendasDetalhadas';

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
    vendasDetalhadas: RelatorioVendasDetalhadas[];
}
