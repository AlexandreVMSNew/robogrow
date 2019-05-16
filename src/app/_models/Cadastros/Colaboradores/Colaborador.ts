import { ColaboradorOcorrencia } from './ColaboradorOcorrencia';
import { ColaboradorNivel } from './ColaboradorNivel';
export class Colaborador {
    id: number;
    userName: string;
    email: string;
    password: string;
    nomeCompleto: string;
    dataNascimento: Date;
    colaboradorOcorrencias: ColaboradorOcorrencia[];
    colaboradorNivel: ColaboradorNivel[];
}
