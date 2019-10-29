import { PermissaoAcoes } from './permissaoAcoes';

export class PermissaoObjetos {
    id: number;
    permissoesId: number;
    objeto: string;
    permissaoAcoes: PermissaoAcoes[];
}
