import { UsuarioNivel } from 'src/app/_models/Cadastros/Usuarios/UsuarioNivel';
export class Usuario {
    id: number;
    userName: string;
    email: string;
    password: string;
    nomeCompleto: string;
    nomeArquivoFotoPerfil: string;
    niveis: UsuarioNivel[];
}
