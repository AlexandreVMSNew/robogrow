import { PlanoContas } from '../../Cadastros/PlanoContas/planoContas';

export class Lancamentos {
    id: number;
    centroDespesaId: number;
    centroReceitaId: number;
    descricao: string;
    planoDebitoId: number;
    planoDebito: PlanoContas;
    planoCreditoId: number;
    planoCredito: PlanoContas;
    valor: number;
    usuarioId: number;
    dataHora: Date;
    dataLancamento: Date;
}
