import { RecebimentoParcelas } from './RecebimentoParcelas';
import { Cliente } from '../../Cadastros/Clientes/Cliente';

export class Recebimentos {
    id: number;
    vendaId: number;
    clientesId: number;
    clientes: Cliente;
    dataEmissao: Date;
    dataCompetencia: Date;
    qtdParcelas: number;
    valorTotal: number;
    planoPagamentoId: number;
    centroReceitaId: number;
    planoContasId: number;
    parcelas: RecebimentoParcelas[];
}
