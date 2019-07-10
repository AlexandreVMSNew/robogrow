import { ClienteVersoes } from 'src/app/_models/Cadastros/Clientes/ClienteVersoes';

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
        sistemaId: number;
        geracaoId: number;
        dataImpCadProd: Date;
        dataImpFrenteLoja: Date;
        dataImpFinanceiro: Date;
        clienteVersoes: ClienteVersoes[];
}
