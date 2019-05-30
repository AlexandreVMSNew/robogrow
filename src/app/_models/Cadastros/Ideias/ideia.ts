import { Usuario } from '../Usuarios/Usuario';

export class Ideia {
    id: number;
    usuarioId: number;
    usuario: Usuario;
    ideia: string;
    dataCadastro: Date;
    status: string;
}
