import { Pipe, PipeTransform } from '@angular/core';
import { horaPattern } from './commons/constants';

const vanillaMasker = require('vanilla-masker');

@Pipe({
  name: 'HoraMinutoPipe'
})
export class HoraMinutoPipe implements PipeTransform {

  transform(value: any) {
    if (!value) {
      return '';
    }
    return vanillaMasker.toPattern(value, horaPattern);
  }

}
