export class PlanoContas {
    id: number;
    descricao: string;
    tipo: string;
    categoria: string;
    nivel: string;
    planoContasId: number;
    planoConta: PlanoContas[];
    valorDebito: number;
    valorCredito: number;
    valorSaldo: number;
    saldoTipo: string;
    espacamento: string;
    negrito: string;
}
