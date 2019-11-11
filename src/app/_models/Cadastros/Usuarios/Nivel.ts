import { PublicacaoNivelMarcacoes } from '../../Publicacoes/PublicacaoNivelMarcacoes';
import { UsuarioNivel } from './UsuarioNivel';

export class Nivel {
    id: number;
    name: string;
    publicacaoNivelMarcacoes: PublicacaoNivelMarcacoes[];
    usuarioNivel: UsuarioNivel[];
}
