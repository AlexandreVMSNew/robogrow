import { Nivel } from './Nivel';
import { ColaboradorOcorrencia } from './ColaboradorOcorrencia';
export class Colaborador {
    id: number;
    userName: string;
    email: string;
    password: string;
    nomeCompleto: string;
    niveis: Nivel[];
    colaboradorOcorrencias: ColaboradorOcorrencia[];
}
