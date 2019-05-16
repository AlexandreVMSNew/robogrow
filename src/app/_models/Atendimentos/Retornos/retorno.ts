import { Cliente } from '../../Cadastros/Clientes/Cliente';

export class Retorno {

    id: number;
    clienteId: number;
    cliente: Cliente;
    contatoNome: string;
    telefone: string;
    prioridade: string;
    observacao: string;
    status: string;
    dataHora: string;
}
