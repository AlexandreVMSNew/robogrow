import { UsuarioOcorrencia } from 'src/app/_models/Cadastros/Usuarios/UsuarioOcorrencia';
import { UsuarioNivel } from 'src/app/_models/Cadastros/Usuarios/UsuarioNivel';
import { PublicacaoUsuarioMarcacoes } from '../../Publicacoes/PublicacaoUsuarioMarcacoes';
export class Usuario {
    id: number;
    userName: string;
    email: string;
    password: string;
    nomeCompleto: string;
    dataNascimento: Date;
    nomeArquivoFotoPerfil: string;
    usuarioOcorrencias: UsuarioOcorrencia[];
    usuarioNivel: UsuarioNivel[];
    publicacaoUsuarioMarcacoes: PublicacaoUsuarioMarcacoes[];
}
