export function removeNonDigitValues(value: string): string {
  return value ? value.replace(/[^0-9]/g, '').trim() : value;
}

export function validarCPF(Objcpf: any) {
  let cpf = Objcpf.value;
  const  exp = /\.|\-/g

  cpf = cpf.toString().replace( exp, '' );
  const digitoDigitado = eval(cpf.charAt(9) + cpf.charAt(10));
  let soma1 = 0;
  let soma2 = 0;
  let vlr = 11;
  let i = 0;
  for (i = 0; i < 9; i++) {
    soma1 += eval((cpf.charAt(i) * (vlr -  1)).toString());
    soma2 += eval((cpf.charAt(i) * vlr).toString());
    vlr--;
  }

  soma1 = (((soma1 * 10) % 11) === 10 ? 0 : ((soma1 * 10) % 11));
  soma2 = (((soma2 + (2 * soma1)) * 10) % 11);

  const digitoGerado = (soma1 * 10) + soma2;
  if (digitoGerado !== digitoDigitado) {
      return false;
  }
  return true;
}

export function validarCNPJ(ObjCnpj: any) {
  let cnpj = ObjCnpj.value;
  const valida = new Array(6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2);
  let dig1 = new Number;
  let dig2 = new Number;

  const exp = /\.|\-|\//g
  cnpj = cnpj.toString().replace( exp, '' );
  const digito = new Number(eval(cnpj.charAt(12) + cnpj.charAt(13)));

  let i = 0;
  for (i = 0; i < valida.length; i++) {
          dig1 += eval((i > 0 ? (cnpj.charAt(i - 1) * valida[i]) : 0).toString());
          dig2 += eval((cnpj.charAt(i) * valida[i]).toString());
  }
  //dig1 = (((dig1 % 11) < 2) ? 0 : (11 - (dig1 % 11)));
  //dig2 = (((dig2 % 11) < 2) ? 0 : (11 - (dig2 % 11)));

  //if(((dig1 * 10) + dig2) !== digito)
    //      alert('CNPJ Invalido!');
}