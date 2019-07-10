import { PessoaTipos } from './PessoaTipos';

export class Pessoa {
    id: number;
    razaoSocial: string;
    nome: string;
    telefone: string;
    celular: string;
    email: string;
    cnpjCpf: string;
    iE: string;
    estadoId: number;
    cidadeId: number;
    cEP: string;
    endereco: string;
    bairro: string;
    status: string;
    pessoaTipos: PessoaTipos[];
}
