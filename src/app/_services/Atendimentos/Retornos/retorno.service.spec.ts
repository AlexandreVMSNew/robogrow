/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RetornoService } from './retorno.service';

describe('Service: Retorno', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RetornoService]
    });
  });

  it('should ...', inject([RetornoService], (service: RetornoService) => {
    expect(service).toBeTruthy();
  }));
});
