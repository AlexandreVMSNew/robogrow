import { Nivel } from '../Cadastros/Usuarios/Nivel';

export class PermissaoAcoes {
    id: number;
    nivelId: number;
    nivel: Nivel;
    permissaoObjetosId: number;
    cadastrar: boolean;
    editar: boolean;
    listar: boolean;
    visualizar: boolean;
    excluir: boolean;
}
