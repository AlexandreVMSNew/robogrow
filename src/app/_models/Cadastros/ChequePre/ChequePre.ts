import { Cliente } from '../Clientes/Cliente';

export class ChequePre {
    id: number;
    clientesId: number;
    clientes: Cliente;
    recebimentoParcelasId: number;
    banco: string;
    agencia: string;
    conta: string;
    numero: string;
    valor: number;
    usuarioLancamentoId: number;
    usuarioBaixadoId: number;
    status: string;
    dataPreDatado: Date;
    dataLancamento: Date;
}
