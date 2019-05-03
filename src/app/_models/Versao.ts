import { Cliente } from './Cliente';
import { ClienteVersoes } from './ClienteVersoes';

export class Versao {
    id: number;
    nome: string;
    clienteVersoes: ClienteVersoes[];
}
