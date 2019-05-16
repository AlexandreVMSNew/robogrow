import { ClienteVersoes } from 'src/app/_models/Cadastros/Clientes/ClienteVersoes';

export class Versao {
    id: number;
    nome: string;
    clienteVersoes: ClienteVersoes[];
}
