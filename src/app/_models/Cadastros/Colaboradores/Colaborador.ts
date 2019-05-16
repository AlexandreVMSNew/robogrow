import { ColaboradorOcorrencia } from 'src/app/_models/Cadastros/Colaboradores/ColaboradorOcorrencia';
import { ColaboradorNivel } from 'src/app/_models/Cadastros/Colaboradores/ColaboradorNivel';
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
