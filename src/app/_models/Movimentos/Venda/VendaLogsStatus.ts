import { Usuario } from '../../Cadastros/Usuarios/Usuario';
import { VendaStatus } from './VendaStatus';

export class VendaLogsStatus {
    id: number;
    vendaId: number;
    usuarioId: number;
    usuario: Usuario;
    dataHora: Date;
    diasCorrente: number;
    vendaStatusId: number;
    vendaStatus: VendaStatus;
}
