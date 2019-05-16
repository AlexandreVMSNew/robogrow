import { Cliente } from '../Clientes/Cliente';
import { ClienteVersoes } from '../Clientes/ClienteVersoes';

export class Versao {
    id: number;
    nome: string;
    clienteVersoes: ClienteVersoes[];
}
