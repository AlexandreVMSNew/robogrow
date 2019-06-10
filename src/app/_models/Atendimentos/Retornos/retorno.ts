import { Cliente } from 'src/app/_models/Cadastros/Clientes/Cliente';
import { Usuario } from '../../Cadastros/Usuarios/Usuario';

export class Retorno {

    id: number;
    clienteId: number;
    cliente: Cliente;
    contatoNome: string;
    telefone: string;
    prioridade: string;
    usuarioId: number;
    usuario: Usuario;
    status: string;
    dataHora: Date;
}
