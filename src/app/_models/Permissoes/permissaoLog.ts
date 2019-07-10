import { Permissao } from './permissao';
import { Usuario } from '../Cadastros/Usuarios/Usuario';

export class PermissaoLog {
    id: number;
    permissaoId: number;
    permissao: Permissao;
    usuarioId: Usuario;
    dataHoraAlteracao: Date;
}
