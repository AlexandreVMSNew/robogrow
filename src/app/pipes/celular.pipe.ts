import { Pipe, PipeTransform } from '@angular/core';
import {telefoneFixoPattern, telefoneCelularPattern} from './commons/constants';
import { removeNonDigitValues } from './commons/utils';

const vanillaMasker = require('vanilla-masker');

@Pipe({
  name: 'celularPipePipe'
})

export class CelularPipe implements PipeTransform {

  transform(value: any) {
    if (!value) {
      return '';
    }

    if (value.length > 13) {
      return vanillaMasker.toPattern(value, telefoneCelularPattern);
    }

    return vanillaMasker.toPattern(value, telefoneFixoPattern);
  }

}
