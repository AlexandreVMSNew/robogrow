import { Colaborador } from 'src/app/_models/Cadastros/Colaboradores/Colaborador';

export class RetornoLog {
    id: number;
    retornoId: number;
    colaboradorId: number;
    colaborador: Colaborador;
    dataHora: string;
    status: string;
}
