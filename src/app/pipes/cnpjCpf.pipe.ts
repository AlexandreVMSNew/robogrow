import { Pipe, PipeTransform } from '@angular/core';
import {cnpjPattern, cpfPattern} from './commons/constants';

const vanillaMasker = require('vanilla-masker');
const CPF_LENGTH = 14;
@Pipe({
  name: 'cnpjCpfPipePipe'
})

export class CnpjCpfPipe implements PipeTransform {

  transform(value: any) {
    if (!value) {
      return '';
    }

    if (value.length > CPF_LENGTH) {
      return vanillaMasker.toPattern(value, cnpjPattern);
    }

    return vanillaMasker.toPattern(value, cpfPattern);
  }

}
