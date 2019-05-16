import { ClienteVersoes } from './ClienteVersoes';

export class Cliente {

        id: number;
        codSiga: string;
        nLoja: string;
        razaoSocial: string;
        nomeFantasia: string;
        grupoId: number;
        categoria: string;
        proprietario: string;
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
        dataImplancatacao: string;
        sistemaId: number;
        geracaoId: number;
        clienteVersoes: ClienteVersoes[];
}
