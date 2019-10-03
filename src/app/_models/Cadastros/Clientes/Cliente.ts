import { ClienteVersoes } from 'src/app/_models/Cadastros/Clientes/ClienteVersoes';
import { Estado } from '../Uteis/Estado';
import { Cidade } from '../Uteis/Cidade';

export class Cliente {

        id: number;
        codSiga: string;
        nLoja: string;
        razaoSocial: string;
        nomeFantasia: string;
        grupoId: number;
        categoria: string;
        contato: string;
        telefone: string;
        celular: string;
        email: string;
        cnpjCpf: string;
        ie: string;
        estadoId: number;
        estado: Estado;
        cidadeId: number;
        cidade: Cidade;
        cep: string;
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
