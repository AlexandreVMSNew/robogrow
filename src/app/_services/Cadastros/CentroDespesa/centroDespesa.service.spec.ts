/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CentroDespesaService } from './centroDespesa.service';

describe('Service: CentroDespesa', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CentroDespesaService]
    });
  });

  it('should ...', inject([CentroDespesaService], (service: CentroDespesaService) => {
    expect(service).toBeTruthy();
  }));
});
