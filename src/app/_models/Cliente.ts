import { Sistema } from './sistema';
import { Geracao } from './geracao';
import { ClienteVersoes } from './ClienteVersoes';
import { Estado } from './Estado';
import { Cidade } from './Cidade';

export class Cliente {

        id: number;
        codSiga: string;
        nLoja: string;
        razaoSocial: string;
        nomeFantasia: string;
        proprietario: string;
        gerente: string;
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
        grupo: string;
        sistemaId: number;
        geracaoId: number;
        clienteVersoes: ClienteVersoes[];
        status: string;
}
