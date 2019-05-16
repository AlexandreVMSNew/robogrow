import { Pipe, PipeTransform } from '@angular/core';
import {iePattern} from './commons/constants';
import { removeNonDigitValues } from './commons/utils';

const vanillaMasker = require('vanilla-masker');

@Pipe({
  name: 'iePipePipe'
})
export class IePipe implements PipeTransform {

  transform(value: any) {
    if (!value) {
      return '';
    }
    
    return vanillaMasker.toPattern(value, iePattern);
  }

}
