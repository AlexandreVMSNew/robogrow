import { Colaborador } from '../../Cadastros/Colaboradores/Colaborador';

export class RetornoLog {
    id: number;
    retornoId: number;
    colaboradorId: number;
    colaborador: Colaborador;
    dataHora: string;
    status: string;
}
