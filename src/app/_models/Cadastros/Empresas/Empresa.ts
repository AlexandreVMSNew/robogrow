import { Estado } from '../Uteis/Estado';
import { Cidade } from '../Uteis/Cidade';

export class Empresa {
    id: number;
    razaoSocial: string;
    nomeFantasia: string;
    telefone: string;
    cnpjCpf: string;
    ie: string;
    estadoId: number;
    estado: Estado;
    cidadeId: number;
    cidade: Cidade;
    cep: string;
    endereco: string;
    bairro: string;
    nomeArquivoLogo: string;
    status: string;
}
