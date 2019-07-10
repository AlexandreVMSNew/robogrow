import { Nivel } from '../Cadastros/Usuarios/Nivel';
import { PermissaoNivel } from './PermissaoNivel';

export class Permissao {
    id: number;
    formulario: string;
    acao: string;
    objeto: string;
    nivelId: number;
    nivel: Nivel;
    permissaoNiveis: PermissaoNivel[];
}
