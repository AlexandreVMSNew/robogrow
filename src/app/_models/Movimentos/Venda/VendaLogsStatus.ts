import { Usuario } from '../../Cadastros/Usuarios/Usuario';

export class VendaLogsStatus {
    id: number;
    vendaId: number;
    usuarioId: number;
    usuario: Usuario;
    dataHora: Date;
    diasCorrente: number;
    status: string;
}
